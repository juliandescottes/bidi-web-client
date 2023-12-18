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
    placeholder: '{ events: ["log.entryAdded"] }',
    value: "{ events: [] }",
  },
  "session.unsubscribe": {
    method: "session.unsubscribe",
    placeholder: '{ events: ["log.entryAdded"] }',
    value: "{ events: [] }",
  },
  "session.end": {
    method: "session.end",
    placeholder: "{}",
  },
  "browser.close": {
    method: "browser.close",
    placeholder: "{}",
  },
  "browsingContext.activate": {
    method: "browsingContext.activate",
    placeholder: "{ context: id }",
    value: '{ context: "" }',
  },
  "browsingContext.captureScreenshot": {
    method: "browsingContext.captureScreenshot",
    placeholder:
      '{ context: id, clip: { type: "element", element: {} }, origin: "document" }',
    value:
      '{ context: "", clip: { type: "element", element: {} }, origin: "document" }',
  },
  "browsingContext.close": {
    method: "browsingContext.close",
    placeholder: "{ context: id }",
    value: '{ context: "" }',
  },
  "browsingContext.create": {
    method: "browsingContext.create",
    placeholder: '{ type: "tab" }',
    value: '{ type: "tab" }',
  },
  "browsingContext.getTree": {
    method: "browsingContext.getTree",
    placeholder: "{ root: id }",
  },
  "browsingContext.handleUserPrompt": {
    method: "browsingContext.handleUserPrompt",
    placeholder: '{ context: id, accept: true, userText: "" }',
    value: '{ context: "", accept: true, userText: "" }',
  },
  "browsingContext.navigate": {
    method: "browsingContext.navigate",
    placeholder: '{ context: id, url: "http://some.url" }',
    value: '{ context: "", url: "" }',
  },
  "browsingContext.print": {
    method: "browsingContext.print",
    placeholder:
      "{ context: id, background: true, margin, orientation, page, pageRanges, scale, shrinkToFit }",
    value: '{ context: "" }',
  },
  "browsingContext.reload": {
    method: "browsingContext.reload",
    placeholder: "{ context: id }",
    value: '{ context: "", url: "" }',
  },
  "browsingContext.setViewport": {
    method: "browsingContext.setViewport",
    placeholder: "{ context: id, viewport: { height, width } }",
    value: '{ context: "", viewport: { height: 640, width: 480 } }',
  },
  "input.performActions": {
    method: "input.performActions",
    placeholder: "{ context: id, actions: [] }",
    value: '{ context: "", actions: [] }',
  },
  "input.releaseActions": {
    method: "input.releaseActions",
    placeholder: "{ context: id }",
    value: '{ context: "" }',
  },
  "network.addIntercept": {
    method: "network.addIntercept",
    placeholder:
      '{ phases: [], urlPatterns: [{ type: "string", pattern: "http://example.com" }] }',
    value: '{ phases: [], urlPatterns: [{ type: "string", pattern: "" }] }',
  },
  "network.failRequest": {
    method: "network.failRequest",
    placeholder: "{ request: requestId }",
    value: '{ request: "" }',
  },
  "network.continueWithAuth": {
    method: "network.continueWithAuth",
    placeholder:
      '{ request: requestId, action: { type: "provideCredentials", credentials: { type: "password", username: "", password: ""} } }',
    value:
      '{ request: "", action: { type: "provideCredentials", credentials: { type: "password", username: "", password: ""} } }',
  },
  "network.removeIntercept": {
    method: "network.removeIntercept",
    placeholder: "{ intercept: interceptId }",
    value: '{ intercept: "" }',
  },
  "script.addPreloadScript": {
    method: "script.addPreloadScript",
    placeholder:
      '{ arguments: [], functionDeclaration: "(arg) => console.log(arg)" }',
    value:
      '{ arguments: [], functionDeclaration: "(arg) => console.log(arg)" }',
  },
  "script.callFunction": {
    method: "script.callFunction",
    placeholder:
      '{ target: { context: id }, awaitPromise: false, arguments: [{ type: "number", value: 1 }], functionDeclaration: "(arg) => console.log(arg)" }',
    value:
      '{ target: { context: "" }, awaitPromise: false, arguments: [], functionDeclaration: "() => {}" }',
  },
  "script.disown": {
    method: "script.disown",
    placeholder: "{ handle: id, target: { context: id } }",
    value: '{ handle: ", target: { context: "" } }',
  },
  "script.evaluate": {
    method: "script.evaluate",
    placeholder:
      '{ target: { context: id }, awaitPromise: false, expression: "console.log(1)" }',
    value: '{ target: { context: "" }, awaitPromise: false, expression: "" }',
  },
  "script.getRealms": {
    method: "script.getRealms",
    placeholder: "{ context: id }",
    value: '{ context: "" }',
  },
  "script.removePreloadScript": {
    method: "script.removePreloadScript",
    placeholder: "{ script: id }",
    value: '{ script: "" }',
  },
};
