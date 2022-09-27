/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export const COMMANDS = {
  "session.new": {
    method: "session.new",
    placeholder: "{ }",
  },
  "session.subscribe": {
    method: "session.subscribe",
    placeholder: "{ events: [\"log.entryAdded\"] }",
  },
  "session.unsubscribe": {
    method: "session.unsubscribe",
    placeholder: "{ events: [\"log.entryAdded\"] }",
  },
  "browsingContext.create": {
    method: "browsingContext.create",
    placeholder: "{ type: \"tab\" }",
  },
  "browsingContext.close": {
    method: "browsingContext.close",
    placeholder: "{ context: id }",
  },
  "browsingContext.getTree": {
    method: "browsingContext.getTree",
    placeholder: "{ root: id }",
  },
  "browsingContext.navigate": {
    method: "browsingContext.navigate",
    placeholder: "{ context: id, url: \"http://some.url\" }",
  },
  "script.evaluate": {
    method: "script.evaluate",
    placeholder: "{ target: { context: id }, awaitPromise: false, expression: \"console.log(1)\" }",
  },
  "script.callFunction": {
    method: "script.callFunction",
    placeholder: "{ target: { context: id }, awaitPromise: false, arguments: [{ type: \"number\", value: 1 }], functionDeclaration: \"(arg) => console.log(arg)\" }",
  },
};
