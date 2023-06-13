/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export const COMMANDS = {
  "session.new": {
    method: "session.new",
    placeholder: "{ capabilities: {} }",
    value: "{ capabilities: {} }",
  },
  "session.subscribe": {
    method: "session.subscribe",
    placeholder: "{ events: [\"log.entryAdded\"] }",
    value: "{ events: [] }",
  },
  "session.unsubscribe": {
    method: "session.unsubscribe",
    placeholder: "{ events: [\"log.entryAdded\"] }",
    value: "{ events: [] }",
  },
  "browsingContext.create": {
    method: "browsingContext.create",
    placeholder: "{ type: \"tab\" }",
    value: "{ type: \"tab\" }",
  },
  "browsingContext.close": {
    method: "browsingContext.close",
    placeholder: "{ context: id }",
    value: "{ context: \"\" }",
  },
  "browsingContext.getTree": {
    method: "browsingContext.getTree",
    placeholder: "{ root: id }",
  },
  "browsingContext.navigate": {
    method: "browsingContext.navigate",
    placeholder: "{ context: id, url: \"http://some.url\" }",
    value: "{ context: \"\", url: \"\" }",
  },
  "script.evaluate": {
    method: "script.evaluate",
    placeholder: "{ target: { context: id }, awaitPromise: false, expression: \"console.log(1)\" }",
    value: "{ target: { context: \"\" }, awaitPromise: false, expression: \"\" }",
  },
  "script.callFunction": {
    method: "script.callFunction",
    placeholder: "{ target: { context: id }, awaitPromise: false, arguments: [{ type: \"number\", value: 1 }], functionDeclaration: \"(arg) => console.log(arg)\" }",
    value: "{ target: { context: \"\" }, awaitPromise: false, arguments: [], functionDeclaration: \"() => {}\" }",
  },
};
