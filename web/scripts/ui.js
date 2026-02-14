/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {
  COMMAND_MODULES,
  getModuleNames,
} from "./commands-generated.js";

export class UI {
  #app;
  #customCommandId;
  #fakeRequest;
  #isConnected;
  #nodeBuilder;
  #currentModule;

  constructor(app) {
    this.#app = app;
    this.#customCommandId = 1;
    this.#fakeRequest = document.querySelector("#fake-request");
    this.#isConnected = false;
    this.#nodeBuilder = document.createElement("div");
    this.#currentModule = null;
  }

  #loadCustomCommands() {
    try {
      const saved = localStorage.getItem("bidi-custom-commands");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load custom commands:", e);
      return [];
    }
  }

  #saveCustomCommands() {
    try {
      const customCommandsList = document.querySelector("#commands-list-custom");
      const customCommands = [];

      customCommandsList.querySelectorAll(".command[data-command^='CUSTOM']").forEach((el) => {
        const method = el.querySelector("input[name=method]")?.value || "";
        const params = el.querySelector("input[name=params]")?.value || "";

        // Only save if method is not empty
        if (method.trim()) {
          customCommands.push({ method, params });
        }
      });

      localStorage.setItem("bidi-custom-commands", JSON.stringify(customCommands));
    } catch (e) {
      console.error("Failed to save custom commands:", e);
    }
  }

  init() {
    // Initialize tabs and command panels
    this.#initTabs();
    this.#initCommands();

    const helpArgumentsEl = document.getElementById(
      "connection-help-arguments",
    );
    helpArgumentsEl.textContent = helpArgumentsEl.textContent.replace(
      "ORIGIN_TOKEN",
      window.location.origin,
    );

    document
      .querySelector("#add-command-button")
      .addEventListener("click", this.#onAddCommandClick);
    document
      .querySelector("#module-tabs")
      .addEventListener("click", this.#onTabClick);
    document
      .querySelector("#module-panels")
      .addEventListener("click", this.#onCommandsContainerClick);
    document
      .querySelector("#module-panels")
      .addEventListener("mouseenter", this.#onHintMouseEnter, true);
    document
      .querySelector("#module-panels")
      .addEventListener("mouseleave", this.#onHintMouseLeave, true);
    document
      .querySelector("#connect")
      .addEventListener("click", this.#onConnectClick);
    document
      .querySelector("#requests-log")
      .addEventListener("click", this.#onRequestsLogClick);
    document
      .querySelector(".clear-button")
      .addEventListener("click", this.#onClearButtonClick);

    this.#app.on("websocket-close", this.#onWebSocketClose);
    this.#app.on("websocket-open", this.#onWebSocketOpen);
    this.#app.on("websocket-message", this.#onWebSocketMessage);
    this.#app.on("request-sent", this.#onRequestSent);
  }

  #initTabs() {
    const tabsContainer = document.querySelector("#module-tabs");
    const panelsContainer = document.querySelector("#module-panels");

    // Get module names and add "custom" for custom commands
    const moduleNames = [...getModuleNames(), "custom"];

    // Create tabs and panels for each module
    moduleNames.forEach((moduleName, index) => {
      // Create tab button
      const tabButton = document.createElement("button");
      tabButton.className = "tab-button";
      if (index === 0) {
        tabButton.classList.add("active");
        this.#currentModule = moduleName;
      }
      tabButton.dataset.module = moduleName;
      tabButton.textContent = this.#formatModuleName(moduleName);
      tabsContainer.appendChild(tabButton);

      // Create tab panel
      const panel = document.createElement("div");
      panel.className = "tab-panel";
      if (index === 0) {
        panel.classList.add("active");
      }
      panel.dataset.module = moduleName;

      const commandsList = document.createElement("div");
      commandsList.className = "commands-list";
      commandsList.id = `commands-list-${moduleName}`;
      panel.appendChild(commandsList);
      panelsContainer.appendChild(panel);
    });
  }

  #initCommands() {
    // Populate commands for each module
    for (const moduleName of getModuleNames()) {
      const commands = COMMAND_MODULES[moduleName].commands;
      const commandsList = document.querySelector(`#commands-list-${moduleName}`);

      for (const commandData of Object.values(commands)) {
        const commandEl = this.#createCommandElement(commandData);
        commandsList.appendChild(commandEl);
      }
    }

    // Load saved custom commands
    const customCommandsList = document.querySelector("#commands-list-custom");
    const savedCommands = this.#loadCustomCommands();

    if (savedCommands.length > 0) {
      // Add saved custom commands
      for (const { method, params } of savedCommands) {
        const commandEl = this.#createCustomCommandElement(method, params);
        customCommandsList.appendChild(commandEl);
      }
    } else {
      // Add at least one empty custom command if none saved
      customCommandsList.appendChild(this.#createCustomCommandElement());
    }
  }

  #formatModuleName(moduleName) {
    if (moduleName === "custom") {
      return "Custom";
    }
    // Convert camelCase to Title Case
    // e.g., "browsingContext" -> "Browsing Context"
    return moduleName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }

  #onTabClick = (e) => {
    if (e.target.classList.contains("tab-button")) {
      this.#switchTab(e.target.dataset.module);
    }
  };

  #switchTab(moduleName) {
    if (this.#currentModule === moduleName) {
      return;
    }

    // Update tab buttons
    document.querySelectorAll(".tab-button").forEach((button) => {
      if (button.dataset.module === moduleName) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });

    // Update tab panels
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      if (panel.dataset.module === moduleName) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });

    this.#currentModule = moduleName;
  }

  #addTraffic(id, msg) {
    document.querySelector("#fake-request")?.remove();
    this.#nodeBuilder.innerHTML = this.#logTemplate("request", id);
    this.#nodeBuilder.querySelector(".log-text").textContent = JSON.stringify(
      msg,
      null,
      "  ",
    );
    const container = document.querySelector("#requests-log");
    if (!container.firstChild) {
      container.appendChild(this.#nodeBuilder.firstChild);
    } else {
      container.insertBefore(
        this.#nodeBuilder.firstChild,
        container.firstChild,
      );
    }
  }

  #createCommandElement(commandData) {
    const { method, specUrl, params, placeholder } = commandData;

    const element = document.createElement("div");
    element.className = "command";
    element.dataset.command = method;

    // Create method display with spec link
    const methodMarkup = `
      <div class="command-header">
        <span class="command-method" title="${method}">${method}</span>
        <a href="${specUrl}" class="command-spec-link" target="_blank" rel="noopener" title="View specification">📖</a>
      </div>
    `;

    element.innerHTML = this.#getCommandElementMarkup(
      methodMarkup,
      placeholder,
      params,
    );

    return element;
  }

  #createCustomCommandElement(method = "", params = "") {
    const element = document.createElement("div");
    element.className = "command custom-command";
    element.dataset.command = "CUSTOM" + this.#customCommandId;
    this.#customCommandId++;

    const paramsPlaceholder = params || `{ key: "value" }`;

    // Create method input without using innerHTML to avoid escaping issues
    const methodInputHTML = `<input type="text" name="method" placeholder="Enter command method">`;

    element.innerHTML = this.#getCommandElementMarkup(
      methodInputHTML,
      paramsPlaceholder,
      {},
    );

    // Add delete button before the send button
    const sendButton = element.querySelector(".command-send");
    const deleteButton = document.createElement("button");
    deleteButton.className = "command-delete";
    deleteButton.textContent = "×";
    deleteButton.title = "Delete custom command";
    deleteButton.type = "button";
    deleteButton.addEventListener("click", () => {
      element.remove();
      this.#saveCustomCommands();
    });
    sendButton.parentNode.insertBefore(deleteButton, sendButton);

    // Set method value after DOM creation to avoid XSS
    const methodInput = element.querySelector("input[name=method]");
    if (methodInput && method) {
      methodInput.value = method;
    }

    // Set params value if provided
    if (params) {
      const paramsInput = element.querySelector("input[name=params]");
      if (paramsInput) {
        paramsInput.value = params;
      }
    }

    // Add event listeners to save on input change
    methodInput?.addEventListener("input", () => {
      this.#saveCustomCommands();
    });
    element.querySelector("input[name=params]")?.addEventListener("input", () => {
      this.#saveCustomCommands();
    });

    return element;
  }

  #getCommandElementMarkup(methodMarkup, placeholder, params) {
    const paramsHint = this.#generateParamsHint(params);
    const hasParams = params && Object.keys(params).length > 0;
    const hintButtonClass = hasParams ? "command-hint-button" : "command-hint-button no-params";

    return `
      <span class="command-info">method</span>
      ${methodMarkup}
      <span class="command-info">params</span>
      <input type="text" name="params"
             placeholder='${placeholder}'
             data-param-types='${JSON.stringify(params)}'
      >
      <button type="button" class="${hintButtonClass}" tabindex="-1">
        <span class="hint-icon">ℹ️</span>
        <div class="command-hint">${paramsHint}</div>
      </button>
      <button class="command-send" ${
        this.#isConnected ? "" : "disabled"
      }>send</button>`;
  }

  #generateParamsHint(params) {
    if (!params || Object.keys(params).length === 0) {
      return "No parameters";
    }

    const lines = [];
    for (const [name, info] of Object.entries(params)) {
      // Special handling for group choices
      if (info.isGroupChoice) {
        lines.push(`<em>Plus one of:</em>`);
        // Split union types and display each on a separate line with indentation
        const types = info.type.split(" | ");
        for (const type of types) {
          lines.push(`  • ${type}`);
        }
        continue;
      }

      const required = info.required ? "required" : "optional";
      const defaultValue = info.default ? ` = ${info.default}` : "";
      lines.push(`<strong>${name}</strong>: ${info.type}${defaultValue} (${required})`);
    }

    return lines.join("\n");
  }

  #logTemplate(type, id) {
    return `<div class="log ${type}">
      <span class=log-id title="click to expand/collapse">${id}</span>
      <span class=log-text></span>
    </div>`;
  }

  #onAddCommandClick = async () => {
    const commandEl = this.#createCustomCommandElement();
    document.querySelector("#commands-list-custom").appendChild(commandEl);

    // Switch to custom tab to show the new command
    this.#switchTab("custom");

    // Save the updated list
    this.#saveCustomCommands();
  };

  #onClearButtonClick = async () => {
    const container = document.querySelector("#requests-log");
    container.innerHTML = "";
    container.appendChild(this.#fakeRequest);
  };

  #onConnectClick = async () => {
    const url = document.querySelector("#url").value;
    this.#app.connectClient(url);
  };

  #onCommandsContainerClick = async (e) => {
    if (
      e.target.classList.contains("command-send") &&
      e.target.closest(".command")
    ) {
      const commandEl = e.target.closest(".command");
      const params =
        commandEl.querySelector("input[name=params]").value || "{}";
      if (commandEl.dataset.command.startsWith("CUSTOM")) {
        await this.#app.sendMessage({
          method: commandEl.querySelector("input[name=method]").value,
          params: eval(`(${params})`),
        });
      } else {
        await this.#app.sendMessage({
          method: commandEl.dataset.command,
          params: eval(`(${params})`),
        });
      }
    }
  };

  #onHintMouseEnter = (e) => {
    if (!e.target.classList.contains("command-hint-button")) return;

    const button = e.target;
    const hint = button.querySelector(".command-hint");
    if (!hint) return;

    // Show the hint
    hint.style.display = "block";

    // Position it
    const buttonRect = button.getBoundingClientRect();
    const hintRect = hint.getBoundingClientRect();

    // Default: above the button, aligned to right
    let top = buttonRect.top - hintRect.height - 5;
    let left = buttonRect.right - hintRect.width;

    // If it goes off the top, position below instead
    if (top < 0) {
      top = buttonRect.bottom + 5;
    }

    // If it goes off the left, align to left edge instead
    if (left < 0) {
      left = buttonRect.left;
    }

    // If it goes off the right, align to right edge
    if (left + hintRect.width > window.innerWidth) {
      left = buttonRect.right - hintRect.width;
    }

    hint.style.top = `${top}px`;
    hint.style.left = `${left}px`;
  };

  #onHintMouseLeave = (e) => {
    if (!e.target.classList.contains("command-hint-button")) return;

    const hint = e.target.querySelector(".command-hint");
    if (hint) {
      hint.style.display = "none";
    }
  };

  #onRequestsLogClick = async (e) => {
    if (!e.target.classList.contains("log-id")) {
      return;
    }

    const requestEl = e.target.closest(".request");
    if (!requestEl) {
      return;
    }

    requestEl.classList.toggle("expanded");
  };

  #onRequestSent = async (e, data) => {
    this.#addTraffic("request", data.msg);
  };

  #onWebSocketClose = () => {
    this.#isConnected = false;
    document.querySelector("#connect").removeAttribute("disabled");
    document.querySelector("#url").removeAttribute("disabled");
    for (const button of document.querySelectorAll(".command-send")) {
      button.setAttribute("disabled", "true");
    }

    document.querySelector("#connect").innerText = "connect";

    this.#addTraffic("ws", "WebSocket closed");
  };

  #onWebSocketOpen = () => {
    this.#isConnected = true;
    document.querySelector("#connect").setAttribute("disabled", "true");
    document.querySelector("#url").setAttribute("disabled", "true");
    for (const button of document.querySelectorAll(".command-send")) {
      button.removeAttribute("disabled");
    }

    document.querySelector("#connect").innerText = "connected";

    this.#addTraffic("ws", "WebSocket open");
  };

  #onWebSocketMessage = (eventName, data) => {
    if (data.id) {
      this.#addTraffic("response", data);
    } else {
      this.#addTraffic("event", data);
    }
  };
}
