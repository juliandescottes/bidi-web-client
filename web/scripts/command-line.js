/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const WELCOME_MESSAGE = `Hi!

The WebDriver BiDi Glitch Client exposes a 'sendCommand' method to write scripts:

  (async function() {
    await sendCommand("session.new", {});
    let res = await sendCommand("browsingContext.getTree", {});

    const context = res.result.contexts[0].context;
    await sendCommand("browsingContext.navigate", {
      context,
      url: "https://example.com",
      wait: "complete"
    });

    // Do stuff ...
  })()

Does not really support events, but if you have setup commands you need to send repeatedly, this can be helpful.
`;

export class CommandLine {
  #app;

  constructor(app) {
    this.#app = app;
  }

  init() {
    console.log(WELCOME_MESSAGE);
    window.sendCommand = (method, params) => this.#sendCommand(method, params);
  }

  async #sendCommand(method, params) {
    const id = await this.#app.sendMessage({ method, params });
    return new Promise((resolve) => {
      const onWsMessage = (eventName, data) => {
        if (data.id === id) {
          this.#app.off("websocket-message", onWsMessage);
          resolve(data);
        }
      };
      this.#app.on("websocket-message", onWsMessage);
    });
  }
}