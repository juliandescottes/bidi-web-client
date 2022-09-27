/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { CommandLine } from "./command-line.js";
import { EventEmitter } from "./event-emitter.js";
import { UI } from "./ui.js";
import { WebSocketClient } from "./websocket-client.js";

class App extends EventEmitter {
  #commandLine;
  #reqId;
  #ui;
  #websocketClient;

  constructor() {
    super();
    this.#commandLine = new CommandLine(this);
    this.#reqId = 1;
    this.#ui = new UI(this);
    this.#websocketClient = new WebSocketClient(this);
  }

  get wsClient() {
    return this.#websocketClient;
  }

  init() {
    this.#commandLine.init();
    this.#ui.init();
    if (localStorage.getItem("sessionId")) {
      this.connectClient(
        localStorage.getItem("sessionHost"),
        localStorage.getItem("sessionId")
      );
    }
  }

  connectClient(host, id) {
    this.#websocketClient.open(`ws://${host}/session${id ? "/" + id : ""}`);
    this.#websocketClient.on("close", (_, data) =>
      this.emit("websocket-close", data)
    );
    this.#websocketClient.on("open", (_, data) => {
      localStorage.setItem("sessionHost", host);
      this.emit("websocket-open", data);
    });
    this.#websocketClient.on("message", (_, data) => {
      if (data?.result?.sessionId) {
        localStorage.setItem("sessionId", data?.result?.sessionId);
      }
      this.emit("websocket-message", data);
    });
  }

  sendMessage(msg) {
    const id = this.#reqId++;
    msg.id = id;
    this.emit("request-sent", { msg });
    this.#websocketClient.sendMessage(msg);
    return id;
  }
}
const app = new App();
app.init();
