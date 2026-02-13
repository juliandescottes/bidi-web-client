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
const CDDL_URL = "https://raw.githubusercontent.com/w3c/webref/main/ed/cddl/webdriver-bidi-remote-cddl.cddl";
const OUTPUT_PATH = path.join(__dirname, "../web/scripts/commands-generated.js");
const SPEC_BASE_URL = "https://w3c.github.io/webdriver-bidi/";

/**
 * Fetch CDDL content from URL
 */
function fetchCDDL() {
  return new Promise((resolve, reject) => {
    console.log("Fetching CDDL from:", CDDL_URL);
    https.get(CDDL_URL, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

/**
 * Parse the CDDL content and extract all commands (not events)
 */
function parseCDDL(cddlContent) {
  console.log("Parsing CDDL commands...");

  const modules = {};
  const lines = cddlContent.split("\n");
  const seenCommands = new Set(); // Track to avoid duplicates

  // Find all command definitions
  // Format: module.CommandName = (
  //           method: "module.commandName",
  //           params: module.CommandNameParameters
  //         )

  const commandRegex = /^([a-z][a-zA-Z]*)\.([A-Z][a-zA-Z]*)\s*=\s*\(/;
  const eventSectionRegex = /^[A-Z][a-zA-Z]*Event\s*=\s*\(/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Stop when we reach the Events section
    if (eventSectionRegex.test(line)) {
      console.log("Reached events section, stopping command parsing");
      break;
    }

    const match = line.match(commandRegex);

    if (match) {
      const moduleName = match[1];
      const commandName = match[2];

      // Extract method name from next line
      const methodLine = lines[i + 1];
      const methodMatch = methodLine?.match(/method:\s*"([^"]+)"/);

      if (!methodMatch) continue;

      const method = methodMatch[1];

      // Skip duplicates
      if (seenCommands.has(method)) {
        continue;
      }
      seenCommands.add(method);

      console.log(`Found: ${method}`);

      // Initialize module if needed
      if (!modules[moduleName]) {
        modules[moduleName] = { commands: {} };
      }

      // Extract parameters
      const params = extractParametersFromCDDL(lines, i, moduleName, commandName);
      const placeholder = generatePlaceholder(params);

      modules[moduleName].commands[method] = {
        method,
        specUrl: generateSpecUrl(moduleName, commandName),
        params,
        placeholder,
      };
    }
  }

  return modules;
}

/**
 * Generate spec URL from module and command name
 */
function generateSpecUrl(moduleName, commandName) {
  // Convert CommandName to command-name for URL
  const commandNameKebab = commandName
    .replace(/([A-Z])/g, (m) => "-" + m.toLowerCase())
    .substring(1); // Remove leading dash

  return `${SPEC_BASE_URL}#command-${moduleName}-${commandNameKebab}`;
}

/**
 * Extract parameters from CDDL definition
 */
function extractParametersFromCDDL(lines, startLine, moduleName, commandName) {
  // Look for parameters definition: module.CommandNameParameters = {
  const paramsTypeName = `${moduleName}.${commandName}Parameters`;

  // Find the parameters definition
  for (let i = startLine; i < Math.min(startLine + 100, lines.length); i++) {
    const line = lines[i];

    if (line.includes(`${paramsTypeName} = {`)) {
      // Found parameters block, parse it
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

    // Parse parameter line
    // Format: ? paramName: type,
    //         paramName: type,
    const paramMatch = line.match(/^\s*(\?)?\s*([a-zA-Z][a-zA-Z0-9]*)\s*:\s*([^,]+),?\s*$/);

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
  type = type.replace(/\s+\/\s+/g, " | ");  // Union types
  type = type.replace(/\s+/g, " ");  // Normalize whitespace
  return type;
}

/**
 * Generate a placeholder object from parameters
 */
function generatePlaceholder(params) {
  const obj = {};

  // Add all required params with empty/example values
  for (const [name, info] of Object.entries(params)) {
    if (info.required) {
      obj[name] = getExampleValue(name, info.type);
    }
  }

  // If no required params, return empty object
  if (Object.keys(obj).length === 0) {
    return "{}";
  }

  return JSON.stringify(obj, null, 2);
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
  if (type.includes("number") || type.includes("int") || type.includes("uint")) return 0;
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
 * Get all module names
 */
export function getModuleNames() {
  return Object.keys(COMMAND_MODULES);
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

    console.log(`\nParsed ${totalCommands} commands from ${Object.keys(modules).length} modules`);
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
