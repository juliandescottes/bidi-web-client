#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Parse WebDriver BiDi CDDL spec and generate commands data
 * Uses the CDDL file from webref: https://github.com/w3c/webref
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

// Configuration
const CDDL_URL =
  "https://raw.githubusercontent.com/w3c/webref/main/ed/cddl/webdriver-bidi-remote-cddl.cddl";
const OUTPUT_PATH = path.join(
  __dirname,
  "../web/scripts/commands-generated.js",
);
const SPEC_BASE_URL = "https://w3c.github.io/webdriver-bidi/";

/**
 * Fetch CDDL content from URL
 */
function fetchCDDL() {
  return new Promise((resolve, reject) => {
    console.log("Fetching CDDL from:", CDDL_URL);
    https
      .get(CDDL_URL, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

/**
 * Parse the CDDL content and extract all commands following CommandData structure
 */
function parseCDDL(cddlContent) {
  console.log("Parsing CDDL commands...");

  const modules = {};
  const lines = cddlContent.split("\n");

  // Step 1: Find CommandData and extract the command union types
  const commandUnions = extractCommandUnions(lines);
  console.log(`Found command unions: ${commandUnions.join(", ")}`);

  // Step 2: For each command union, extract the actual commands
  const allCommandNames = [];
  for (const unionName of commandUnions) {
    const commands = extractCommandsFromUnion(lines, unionName);
    allCommandNames.push(...commands);
  }

  console.log(`Found ${allCommandNames.length} total commands\n`);

  // Step 3: For each command, extract its details
  for (const commandNamePascal of allCommandNames) {
    const [moduleName, cmdNamePascal] = commandNamePascal.split(".");

    // Convert to camelCase for method name: browser.Close -> browser.close
    const cmdNameCamel =
      cmdNamePascal.charAt(0).toLowerCase() + cmdNamePascal.slice(1);
    const commandMethod = `${moduleName}.${cmdNameCamel}`;

    // Find the command definition using PascalCase name
    const commandDef = findCommandDefinition(lines, moduleName, cmdNamePascal);
    if (!commandDef) {
      console.log(
        `Warning: Could not find definition for ${commandNamePascal}`,
      );
      continue;
    }

    console.log(`Found: ${commandMethod}`);

    // Initialize module if needed
    if (!modules[moduleName]) {
      modules[moduleName] = { commands: {} };
    }

    // Extract parameters
    const params = extractParametersFromCDDL(
      lines,
      commandDef.lineIndex,
      moduleName,
      cmdNamePascal,
    );
    const placeholder = generatePlaceholder(params);

    modules[moduleName].commands[commandMethod] = {
      method: commandMethod,
      specUrl: generateSpecUrl(moduleName, cmdNamePascal),
      params,
      placeholder,
    };
  }

  return modules;
}

/**
 * Extract command union names from CommandData
 */
function extractCommandUnions(lines) {
  const unions = [];
  let inCommandData = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.match(/^CommandData\s*=\s*\(/)) {
      inCommandData = true;
      continue;
    }

    if (inCommandData) {
      if (line.includes(")")) {
        break;
      }

      const match = line.match(/^\s*([A-Z][a-zA-Z]+Command)\s*\/?\/?/);
      if (match) {
        unions.push(match[1]);
      }
    }
  }

  return unions;
}

/**
 * Extract command names from a command union definition
 */
function extractCommandsFromUnion(lines, unionName) {
  const commands = [];
  let inUnion = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.match(new RegExp(`^${unionName}\\s*=\\s*\\(`))) {
      inUnion = true;
      continue;
    }

    if (inUnion) {
      if (line.includes(")")) {
        break;
      }

      const match = line.match(/^\s*([a-z][a-zA-Z]*\.[A-Z][a-zA-Z]*)\s*\/?\/?/);
      if (match) {
        commands.push(match[1]);
      }
    }
  }

  return commands;
}

/**
 * Find the definition line for a specific command
 */
function findCommandDefinition(lines, moduleName, commandName) {
  const pattern = new RegExp(`^${moduleName}\\.${commandName}\\s*=\\s*\\(`);

  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      return { lineIndex: i };
    }
  }

  return null;
}

/**
 * Generate spec URL from module and command name (PascalCase)
 */
function generateSpecUrl(moduleName, commandNamePascal) {
  // Convert PascalCase CommandName to kebab-case command-name for URL
  const commandNameKebab = commandNamePascal
    .replace(/([A-Z])/g, (m) => "-" + m.toLowerCase())
    .substring(1); // Remove leading dash

  return `${SPEC_BASE_URL}#command-${moduleName}-${commandNameKebab}`;
}

/**
 * Extract parameters from CDDL definition
 */
function extractParametersFromCDDL(lines, startLine, moduleName, commandName) {
  // Look for parameters definition: module.CommandNameParameters = {
  // Try both PascalCase and camelCase (some commands use lowercase)
  const paramsTypeNamePascal = `${moduleName}.${commandName}Parameters`;
  const paramsTypeNameCamel = `${moduleName}.${commandName.charAt(0).toLowerCase() + commandName.slice(1)}Parameters`;

  // Parameter types can be defined anywhere in the file (often before the command)
  // So we search the entire file, not just near the command definition
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for direct struct definition
    if (line.includes(`${paramsTypeNamePascal} = {`) || line.includes(`${paramsTypeNameCamel} = {`)) {
      // Found parameters block, parse it
      return parseParametersBlock(lines, i + 1);
    }

    // Check for union type (e.g., Parameters = Type1 / Type2)
    const unionMatch = line.match(new RegExp(`(${paramsTypeNamePascal}|${paramsTypeNameCamel})\\s*=\\s*([^{][^\\n]+)`));
    if (unionMatch) {
      const typeDef = unionMatch[2];

      // Check if it's a union of types (contains //)
      if (typeDef.includes('/')) {
        const unionTypes = typeDef.split('/').map(t => t.trim());

        // Collect parameters from all union member types
        const allParams = {};
        for (const typeName of unionTypes) {
          const typeParams = findTypeDefinition(lines, typeName);
          Object.assign(allParams, typeParams);
        }

        // If we found any parameters, add a note about the union
        if (Object.keys(allParams).length > 0) {
          allParams["[one of]"] = {
            type: unionTypes.join(" | "),
            required: true,
            isGroupChoice: true,
          };
        }

        return allParams;
      }
    }
  }

  return {};
}

/**
 * Find and parse a type definition by name
 */
function findTypeDefinition(lines, typeName) {
  const cleanTypeName = typeName.trim();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes(`${cleanTypeName} = {`)) {
      return parseParametersBlock(lines, i + 1);
    }
  }

  return {};
}

/**
 * Parse a parameters block from CDDL
 */
function parseParametersBlock(lines, startLine) {
  const params = {};
  let braceDepth = 1;

  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i];

    // Track brace depth
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    braceDepth += openBraces - closeBraces;

    // End of parameters block
    if (braceDepth === 0) {
      break;
    }

    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith(";")) {
      continue;
    }

    // Check for group choice (union of types)
    // Format: (Type1 // Type2 // Type3)
    const groupChoiceMatch = line.match(/^\s*\(([^)]+)\)\s*$/);
    if (groupChoiceMatch) {
      const types = groupChoiceMatch[1]
        .split("//")
        .map((t) => t.trim())
        .filter((t) => t);

      // Add a special entry for the group choice
      params["[one of]"] = {
        type: types.join(" | "),
        required: true,
        isGroupChoice: true,
      };
      continue;
    }

    // Parse parameter line
    // Format: ? paramName: type,
    //         paramName: type,
    const paramMatch = line.match(
      /^\s*(\?)?\s*([a-zA-Z][a-zA-Z0-9]*)\s*:\s*([^,]+),?\s*$/,
    );

    if (paramMatch) {
      const optional = !!paramMatch[1];
      const paramName = paramMatch[2];
      let paramType = paramMatch[3].trim();

      // Check for default values (in comments or inline)
      // CDDL doesn't have .default like in the spec, so we'll extract what we can
      paramType = cleanupType(paramType);

      params[paramName] = {
        type: paramType,
        required: !optional,
      };
    }
  }

  return params;
}

/**
 * Clean up CDDL type notation for display
 */
function cleanupType(type) {
  // Replace CDDL notation with more readable format
  type = type.replace(/\s+\/\s+/g, " | "); // Union types
  type = type.replace(/\s+/g, " "); // Normalize whitespace
  return type;
}

/**
 * Generate a placeholder object from parameters
 */
function generatePlaceholder(params) {
  const obj = {};

  // Add all required params with empty/example values
  for (const [name, info] of Object.entries(params)) {
    // Skip group choices in placeholder - they're informational only
    if (info.isGroupChoice) {
      continue;
    }

    if (info.required) {
      obj[name] = getExampleValue(name, info.type);
    }
  }

  // If no required params, return empty object
  if (Object.keys(obj).length === 0) {
    return "{}";
  }

  return JSON.stringify(obj);
}

/**
 * Get example value based on parameter name and type
 */
function getExampleValue(name, type) {
  // Check common parameter names
  if (name === "context") return "";
  if (name === "url") return "";
  if (name === "capabilities") return {};
  if (name === "events") return [];
  if (name === "handle" || name === "script" || name === "request") return "";
  if (name === "target") return { context: "" };
  if (name === "functionDeclaration") return "() => {}";
  if (name === "expression") return "";
  if (name === "actions") return [];
  if (name === "phases") return [];
  if (name === "urlPatterns") return [];
  if (name.toLowerCase().includes("id")) return "";

  // Check type patterns
  if (type.includes("text") || type.includes("string")) return "";
  if (type.includes("bool")) return false;
  if (type.includes("number") || type.includes("int") || type.includes("uint"))
    return 0;
  if (type.includes("[")) return [];
  if (type.includes("{") || type.includes(".")) return {};

  // Default to empty string
  return "";
}

/**
 * Generate the output JavaScript module
 */
function generateOutput(modules) {
  let output = `/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 *
 * Generated from WebDriver BiDi CDDL specification
 * Source: ${CDDL_URL}
 * Run: npm run build:commands
 *
 * Spec: ${SPEC_BASE_URL}
 */

export const COMMAND_MODULES = ${JSON.stringify(modules, null, 2)};

/**
 * Get all module names (session first, then alphabetical)
 */
export function getModuleNames() {
  const names = Object.keys(COMMAND_MODULES);
  return names.sort((a, b) => {
    if (a === "session") return -1;
    if (b === "session") return 1;
    return a.localeCompare(b);
  });
}

/**
 * Get all commands for a module
 */
export function getModuleCommands(moduleName) {
  return COMMAND_MODULES[moduleName]?.commands || {};
}

/**
 * Get a specific command
 */
export function getCommand(method) {
  for (const module of Object.values(COMMAND_MODULES)) {
    if (module.commands[method]) {
      return module.commands[method];
    }
  }
  return null;
}
`;

  return output;
}

/**
 * Main execution
 */
async function main() {
  try {
    // Fetch CDDL content
    const cddlContent = await fetchCDDL();

    // Parse the CDDL
    const modules = parseCDDL(cddlContent);

    // Count commands
    let totalCommands = 0;
    for (const module of Object.values(modules)) {
      totalCommands += Object.keys(module.commands).length;
    }

    console.log(
      `\nParsed ${totalCommands} commands from ${
        Object.keys(modules).length
      } modules`,
    );
    console.log("Modules:", Object.keys(modules).join(", "));

    // Generate output
    const output = generateOutput(modules);

    // Write output file
    console.log(`\nWriting to: ${OUTPUT_PATH}`);
    fs.writeFileSync(OUTPUT_PATH, output, "utf-8");

    console.log("✓ Commands generated successfully!");
    console.log(`  Total commands: ${totalCommands}`);
    console.log(`  Output: ${OUTPUT_PATH}`);
    console.log(`  Source: ${CDDL_URL}`);
  } catch (error) {
    console.error("Error generating commands:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run main function
main();
