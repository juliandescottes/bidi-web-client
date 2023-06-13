/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { COMMANDS } from "./commands.js";

export class UI {
  #app;
  #customCommandId;
  #fakeRequest;
  #nodeBuilder;

  constructor(app) {
    this.#app = app;
    this.#customCommandId = 1;
    this.#fakeRequest = document.querySelector("#fake-request");
    this.#nodeBuilder = document.createElement("div");;
  }

  init() {
    for (const { method, placeholder, value } of Object.values(COMMANDS)) {
      const commandEl = this.#createCommandElement(method, placeholder, value);
      document.querySelector("#commands-container").appendChild(commandEl);
    }
    document
      .querySelector("#commands-container")
      .appendChild(this.#createCustomCommandElement());

    const helpArgumentsEl = document.getElementById("connection-help-arguments");
    helpArgumentsEl.textContent = helpArgumentsEl.textContent.replace(
      "ORIGIN_TOKEN",
      window.location.origin
    );

    document.querySelector("#add-command-button").addEventListener("click", this.#onAddCommandClick);
    document.querySelector("#commands-container").addEventListener("click", this.#onCommandsContainerClick);
    document.querySelector("#connect").addEventListener("click", this.#onConnectClick);
    document.querySelector("#requests-log").addEventListener("click", this.#onRequestsLogClick);
    document.querySelector(".clear-button").addEventListener("click", this.#onClearButtonClick);

    this.#app.on("websocket-close", this.#onWebSocketClose);
    this.#app.on("websocket-open", this.#onWebSocketOpen);
    this.#app.on("websocket-message", this.#onWebSocketMessage);
    this.#app.on("request-sent", this.#onRequestSent);
  }

  #addTraffic(id, msg) {
    document.querySelector("#fake-request")?.remove();
    this.#nodeBuilder.innerHTML = this.#logTemplate("request", id);
    this.#nodeBuilder.querySelector(".log-text").textContent = JSON.stringify(
      msg,
      null,
      "  "
    );
    const container = document.querySelector("#requests-log");
    if (!container.firstChild) {
      container.appendChild(this.#nodeBuilder.firstChild);
    } else {
      container.insertBefore(this.#nodeBuilder.firstChild, container.firstChild);
    }
  }

  #createCommandElement(method, placeholder, value) {
    const element = document.createElement("div");
    element.className = "command";
    element.dataset.command = method;
    element.innerHTML = this.#getCommandElementMarkup(
      `<span class="command-method">${method}</span>`,
      placeholder,
      value
    );

    return element;
  }

  #createCustomCommandElement() {
    const element = document.createElement("div");
    element.className = "command";
    element.dataset.command = "CUSTOM" + this.#customCommandId;
    this.#customCommandId++;
    element.innerHTML = this.#getCommandElementMarkup(
      `<input type="text" name="method" placeholder="">`,
      `{ key: "value" }`
    );

    return element;
  }

  #getCommandElementMarkup(methodMarkup, placeholder, value) {
    return `
      <span class="command-info">method</span>
      ${methodMarkup}
      <span class="command-info">params</span>
      <input type="text" name="params"
             placeholder='${placeholder}'
             ${value ? "value='" + value + "'" : ""}
      >
      <button class="command-send">send</button>`;
  }

  #logTemplate(type, id) {
    return `<div class="log ${type}">
      <span class=log-id title="click to expand/collapse">${id}</span>
      <span class=log-text></span>
    </div>`;
  }

  #onAddCommandClick = async () => {
    const commandEl = this.#createCustomCommandElement();
    document.querySelector("#commands-container").appendChild(commandEl);
  }

  #onClearButtonClick = async () => {
    const container = document.querySelector("#requests-log");
    container.innerHTML = "";
    container.appendChild(this.#fakeRequest);
  }

  #onConnectClick = async () => {
    const host = document.querySelector("#host").value;
    this.#app.connectClient(host);
  }

  #onCommandsContainerClick = async (e) => {
    if (
      e.target.classList.contains("command-send") &&
      e.target.closest(".command")
    ) {
      const commandEl = e.target.closest(".command");
      const params = commandEl.querySelector("input[name=params]").value || "{}";
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
  }

  #onRequestsLogClick = async (e) => {
    if (!e.target.classList.contains("log-id")) {
      return;
    }

    const requestEl = e.target.closest(".request");
    if (!requestEl) {
      return;
    }

    requestEl.classList.toggle("expanded");
  }

  #onRequestSent = async (e, data) => {
    this.#addTraffic("request", data.msg);
  }

  #onWebSocketClose = () => {
    document.querySelector("#connect").removeAttribute("disabled");
    document.querySelector("#host").removeAttribute("disabled");
    document.querySelector("#connect").innerText = "connect";
    this.#addTraffic("ws", "WebSocket closed");
  }

  #onWebSocketOpen = () => {
    document.querySelector("#connect").setAttribute("disabled", "true");
    document.querySelector("#host").setAttribute("disabled", "true");
    document.querySelector("#connect").innerText = "connected";
    this.#addTraffic("ws", "WebSocket open");
  }

  #onWebSocketMessage = (eventName, data) => {
    if (data.id) {
      this.#addTraffic("response", data);
    } else {
      this.#addTraffic("event", data);
    }
  }
}
