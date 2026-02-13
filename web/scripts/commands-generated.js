/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 *
 * Generated from WebDriver BiDi CDDL specification
 * Source: https://raw.githubusercontent.com/w3c/webref/main/ed/cddl/webdriver-bidi-remote-cddl.cddl
 * Run: npm run build:commands
 *
 * Spec: https://w3c.github.io/webdriver-bidi/
 */

export const COMMAND_MODULES = {
  "session": {
    "commands": {
      "session.status": {
        "method": "session.status",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-session-status",
        "params": {},
        "placeholder": "{}"
      },
      "session.new": {
        "method": "session.new",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-session-new",
        "params": {
          "capabilities": {
            "type": "session.CapabilitiesRequest",
            "required": true
          }
        },
        "placeholder": "{\n  \"capabilities\": {}\n}"
      },
      "session.end": {
        "method": "session.end",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-session-end",
        "params": {},
        "placeholder": "{}"
      },
      "session.subscribe": {
        "method": "session.subscribe",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-session-subscribe",
        "params": {},
        "placeholder": "{}"
      },
      "session.unsubscribe": {
        "method": "session.unsubscribe",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-session-unsubscribe",
        "params": {},
        "placeholder": "{}"
      }
    }
  },
  "browser": {
    "commands": {
      "browser.close": {
        "method": "browser.close",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browser-close",
        "params": {},
        "placeholder": "{}"
      },
      "browser.createUserContext": {
        "method": "browser.createUserContext",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browser-create-user-context",
        "params": {
          "acceptInsecureCerts": {
            "type": "bool",
            "required": false
          },
          "proxy": {
            "type": "session.ProxyConfiguration",
            "required": false
          },
          "unhandledPromptBehavior": {
            "type": "session.UserPromptHandler",
            "required": false
          }
        },
        "placeholder": "{}"
      },
      "browser.getClientWindows": {
        "method": "browser.getClientWindows",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browser-get-client-windows",
        "params": {},
        "placeholder": "{}"
      },
      "browser.getUserContexts": {
        "method": "browser.getUserContexts",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browser-get-user-contexts",
        "params": {},
        "placeholder": "{}"
      },
      "browser.removeUserContext": {
        "method": "browser.removeUserContext",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browser-remove-user-context",
        "params": {
          "userContext": {
            "type": "browser.UserContext",
            "required": true
          }
        },
        "placeholder": "{\n  \"userContext\": \"\"\n}"
      },
      "browser.setClientWindowState": {
        "method": "browser.setClientWindowState",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browser-set-client-window-state",
        "params": {
          "clientWindow": {
            "type": "browser.ClientWindow",
            "required": true
          }
        },
        "placeholder": "{\n  \"clientWindow\": {}\n}"
      },
      "browser.setDownloadBehavior": {
        "method": "browser.setDownloadBehavior",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browser-set-download-behavior",
        "params": {
          "downloadBehavior": {
            "type": "browser.DownloadBehavior | null",
            "required": true
          },
          "userContexts": {
            "type": "[+browser.UserContext]",
            "required": false
          }
        },
        "placeholder": "{\n  \"downloadBehavior\": {}\n}"
      }
    }
  },
  "browsingContext": {
    "commands": {
      "browsingContext.activate": {
        "method": "browsingContext.activate",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browsingContext-activate",
        "params": {
          "context": {
            "type": "browsingContext.BrowsingContext",
            "required": true
          }
        },
        "placeholder": "{\n  \"context\": \"\"\n}"
      },
      "browsingContext.captureScreenshot": {
        "method": "browsingContext.captureScreenshot",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browsingContext-capture-screenshot",
        "params": {
          "context": {
            "type": "browsingContext.BrowsingContext",
            "required": true
          },
          "origin": {
            "type": "(\"viewport\" | \"document\") .default \"viewport\"",
            "required": false
          },
          "format": {
            "type": "browsingContext.ImageFormat",
            "required": false
          },
          "clip": {
            "type": "browsingContext.ClipRectangle",
            "required": false
          }
        },
        "placeholder": "{\n  \"context\": \"\"\n}"
      },
      "browsingContext.close": {
        "method": "browsingContext.close",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browsingContext-close",
        "params": {
          "context": {
            "type": "browsingContext.BrowsingContext",
            "required": true
          },
          "promptUnload": {
            "type": "bool .default false",
            "required": false
          }
        },
        "placeholder": "{\n  \"context\": \"\"\n}"
      },
      "browsingContext.create": {
        "method": "browsingContext.create",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browsingContext-create",
        "params": {
          "type": {
            "type": "browsingContext.CreateType",
            "required": true
          },
          "referenceContext": {
            "type": "browsingContext.BrowsingContext",
            "required": false
          },
          "background": {
            "type": "bool .default false",
            "required": false
          },
          "userContext": {
            "type": "browser.UserContext",
            "required": false
          }
        },
        "placeholder": "{\n  \"type\": \"\"\n}"
      },
      "browsingContext.getTree": {
        "method": "browsingContext.getTree",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browsingContext-get-tree",
        "params": {
          "maxDepth": {
            "type": "js-uint",
            "required": false
          },
          "root": {
            "type": "browsingContext.BrowsingContext",
            "required": false
          }
        },
        "placeholder": "{}"
      },
      "browsingContext.handleUserPrompt": {
        "method": "browsingContext.handleUserPrompt",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browsingContext-handle-user-prompt",
        "params": {
          "context": {
            "type": "browsingContext.BrowsingContext",
            "required": true
          },
          "accept": {
            "type": "bool",
            "required": false
          },
          "userText": {
            "type": "text",
            "required": false
          }
        },
        "placeholder": "{\n  \"context\": \"\"\n}"
      },
      "browsingContext.locateNodes": {
        "method": "browsingContext.locateNodes",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browsingContext-locate-nodes",
        "params": {
          "context": {
            "type": "browsingContext.BrowsingContext",
            "required": true
          },
          "locator": {
            "type": "browsingContext.Locator",
            "required": true
          },
          "maxNodeCount": {
            "type": "(js-uint .ge 1)",
            "required": false
          },
          "serializationOptions": {
            "type": "script.SerializationOptions",
            "required": false
          },
          "startNodes": {
            "type": "[ + script.SharedReference ]",
            "required": false
          }
        },
        "placeholder": "{\n  \"context\": \"\",\n  \"locator\": \"\"\n}"
      },
      "browsingContext.navigate": {
        "method": "browsingContext.navigate",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browsingContext-navigate",
        "params": {
          "context": {
            "type": "browsingContext.BrowsingContext",
            "required": true
          },
          "url": {
            "type": "text",
            "required": true
          },
          "wait": {
            "type": "browsingContext.ReadinessState",
            "required": false
          }
        },
        "placeholder": "{\n  \"context\": \"\",\n  \"url\": \"\"\n}"
      },
      "browsingContext.print": {
        "method": "browsingContext.print",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browsingContext-print",
        "params": {
          "context": {
            "type": "browsingContext.BrowsingContext",
            "required": true
          },
          "background": {
            "type": "bool .default false",
            "required": false
          },
          "margin": {
            "type": "browsingContext.PrintMarginParameters",
            "required": false
          },
          "orientation": {
            "type": "(\"portrait\" | \"landscape\") .default \"portrait\"",
            "required": false
          },
          "page": {
            "type": "browsingContext.PrintPageParameters",
            "required": false
          },
          "pageRanges": {
            "type": "[*(js-uint | text)]",
            "required": false
          },
          "scale": {
            "type": "(0.1..2.0) .default 1.0",
            "required": false
          },
          "shrinkToFit": {
            "type": "bool .default true",
            "required": false
          }
        },
        "placeholder": "{\n  \"context\": \"\"\n}"
      },
      "browsingContext.reload": {
        "method": "browsingContext.reload",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browsingContext-reload",
        "params": {
          "context": {
            "type": "browsingContext.BrowsingContext",
            "required": true
          },
          "ignoreCache": {
            "type": "bool",
            "required": false
          },
          "wait": {
            "type": "browsingContext.ReadinessState",
            "required": false
          }
        },
        "placeholder": "{\n  \"context\": \"\"\n}"
      },
      "browsingContext.setViewport": {
        "method": "browsingContext.setViewport",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browsingContext-set-viewport",
        "params": {
          "context": {
            "type": "browsingContext.BrowsingContext",
            "required": false
          },
          "viewport": {
            "type": "browsingContext.Viewport | null",
            "required": false
          },
          "devicePixelRatio": {
            "type": "(float .gt 0.0) | null",
            "required": false
          },
          "userContexts": {
            "type": "[+browser.UserContext]",
            "required": false
          }
        },
        "placeholder": "{}"
      },
      "browsingContext.traverseHistory": {
        "method": "browsingContext.traverseHistory",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-browsingContext-traverse-history",
        "params": {
          "context": {
            "type": "browsingContext.BrowsingContext",
            "required": true
          },
          "delta": {
            "type": "js-int",
            "required": true
          }
        },
        "placeholder": "{\n  \"context\": \"\",\n  \"delta\": 0\n}"
      }
    }
  },
  "emulation": {
    "commands": {
      "emulation.setForcedColorsModeThemeOverride": {
        "method": "emulation.setForcedColorsModeThemeOverride",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-emulation-set-forced-colors-mode-theme-override",
        "params": {
          "theme": {
            "type": "emulation.ForcedColorsModeTheme | null",
            "required": true
          },
          "contexts": {
            "type": "[+browsingContext.BrowsingContext]",
            "required": false
          },
          "userContexts": {
            "type": "[+browser.UserContext]",
            "required": false
          }
        },
        "placeholder": "{\n  \"theme\": {}\n}"
      },
      "emulation.setGeolocationOverride": {
        "method": "emulation.setGeolocationOverride",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-emulation-set-geolocation-override",
        "params": {
          "contexts": {
            "type": "[+browsingContext.BrowsingContext]",
            "required": false
          },
          "userContexts": {
            "type": "[+browser.UserContext]",
            "required": false
          }
        },
        "placeholder": "{}"
      },
      "emulation.setLocaleOverride": {
        "method": "emulation.setLocaleOverride",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-emulation-set-locale-override",
        "params": {
          "locale": {
            "type": "text | null",
            "required": true
          },
          "contexts": {
            "type": "[+browsingContext.BrowsingContext]",
            "required": false
          },
          "userContexts": {
            "type": "[+browser.UserContext]",
            "required": false
          }
        },
        "placeholder": "{\n  \"locale\": \"\"\n}"
      },
      "emulation.setNetworkConditions": {
        "method": "emulation.setNetworkConditions",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-emulation-set-network-conditions",
        "params": {},
        "placeholder": "{}"
      },
      "emulation.setScreenSettingsOverride": {
        "method": "emulation.setScreenSettingsOverride",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-emulation-set-screen-settings-override",
        "params": {
          "screenArea": {
            "type": "emulation.ScreenArea | null",
            "required": true
          },
          "contexts": {
            "type": "[+browsingContext.BrowsingContext]",
            "required": false
          },
          "userContexts": {
            "type": "[+browser.UserContext]",
            "required": false
          }
        },
        "placeholder": "{\n  \"screenArea\": {}\n}"
      },
      "emulation.setScreenOrientationOverride": {
        "method": "emulation.setScreenOrientationOverride",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-emulation-set-screen-orientation-override",
        "params": {
          "screenOrientation": {
            "type": "emulation.ScreenOrientation | null",
            "required": true
          },
          "contexts": {
            "type": "[+browsingContext.BrowsingContext]",
            "required": false
          },
          "userContexts": {
            "type": "[+browser.UserContext]",
            "required": false
          }
        },
        "placeholder": "{\n  \"screenOrientation\": {}\n}"
      },
      "emulation.setUserAgentOverride": {
        "method": "emulation.setUserAgentOverride",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-emulation-set-user-agent-override",
        "params": {
          "userAgent": {
            "type": "text | null",
            "required": true
          },
          "contexts": {
            "type": "[+browsingContext.BrowsingContext]",
            "required": false
          },
          "userContexts": {
            "type": "[+browser.UserContext]",
            "required": false
          }
        },
        "placeholder": "{\n  \"userAgent\": \"\"\n}"
      },
      "emulation.setScriptingEnabled": {
        "method": "emulation.setScriptingEnabled",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-emulation-set-scripting-enabled",
        "params": {
          "enabled": {
            "type": "false | null",
            "required": true
          },
          "contexts": {
            "type": "[+browsingContext.BrowsingContext]",
            "required": false
          },
          "userContexts": {
            "type": "[+browser.UserContext]",
            "required": false
          }
        },
        "placeholder": "{\n  \"enabled\": \"\"\n}"
      },
      "emulation.setTimezoneOverride": {
        "method": "emulation.setTimezoneOverride",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-emulation-set-timezone-override",
        "params": {
          "timezone": {
            "type": "text | null",
            "required": true
          },
          "contexts": {
            "type": "[+browsingContext.BrowsingContext]",
            "required": false
          },
          "userContexts": {
            "type": "[+browser.UserContext]",
            "required": false
          }
        },
        "placeholder": "{\n  \"timezone\": \"\"\n}"
      },
      "emulation.setTouchOverride": {
        "method": "emulation.setTouchOverride",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-emulation-set-touch-override",
        "params": {
          "maxTouchPoints": {
            "type": "(js-uint .ge 1) | null",
            "required": true
          },
          "contexts": {
            "type": "[+browsingContext.BrowsingContext]",
            "required": false
          },
          "userContexts": {
            "type": "[+browser.UserContext]",
            "required": false
          }
        },
        "placeholder": "{\n  \"maxTouchPoints\": 0\n}"
      }
    }
  },
  "network": {
    "commands": {
      "network.addDataCollector": {
        "method": "network.addDataCollector",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-network-add-data-collector",
        "params": {
          "dataTypes": {
            "type": "[+network.DataType]",
            "required": true
          },
          "maxEncodedDataSize": {
            "type": "js-uint",
            "required": true
          },
          "collectorType": {
            "type": "network.CollectorType .default \"blob\"",
            "required": false
          },
          "contexts": {
            "type": "[+browsingContext.BrowsingContext]",
            "required": false
          },
          "userContexts": {
            "type": "[+browser.UserContext]",
            "required": false
          }
        },
        "placeholder": "{\n  \"dataTypes\": [],\n  \"maxEncodedDataSize\": 0\n}"
      },
      "network.addIntercept": {
        "method": "network.addIntercept",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-network-add-intercept",
        "params": {
          "phases": {
            "type": "[+network.InterceptPhase]",
            "required": true
          },
          "contexts": {
            "type": "[+browsingContext.BrowsingContext]",
            "required": false
          },
          "urlPatterns": {
            "type": "[*network.UrlPattern]",
            "required": false
          }
        },
        "placeholder": "{\n  \"phases\": []\n}"
      },
      "network.continueRequest": {
        "method": "network.continueRequest",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-network-continue-request",
        "params": {
          "request": {
            "type": "network.Request",
            "required": true
          },
          "body": {
            "type": "network.BytesValue",
            "required": false
          },
          "cookies": {
            "type": "[*network.CookieHeader]",
            "required": false
          },
          "headers": {
            "type": "[*network.Header]",
            "required": false
          },
          "method": {
            "type": "text",
            "required": false
          },
          "url": {
            "type": "text",
            "required": false
          }
        },
        "placeholder": "{\n  \"request\": \"\"\n}"
      },
      "network.continueResponse": {
        "method": "network.continueResponse",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-network-continue-response",
        "params": {
          "request": {
            "type": "network.Request",
            "required": true
          },
          "cookies": {
            "type": "[*network.SetCookieHeader]",
            "required": false
          },
          "credentials": {
            "type": "network.AuthCredentials",
            "required": false
          },
          "headers": {
            "type": "[*network.Header]",
            "required": false
          },
          "reasonPhrase": {
            "type": "text",
            "required": false
          },
          "statusCode": {
            "type": "js-uint",
            "required": false
          }
        },
        "placeholder": "{\n  \"request\": \"\"\n}"
      },
      "network.continueWithAuth": {
        "method": "network.continueWithAuth",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-network-continue-with-auth",
        "params": {
          "request": {
            "type": "network.Request",
            "required": true
          }
        },
        "placeholder": "{\n  \"request\": \"\"\n}"
      },
      "network.disownData": {
        "method": "network.disownData",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-network-disown-data",
        "params": {},
        "placeholder": "{}"
      },
      "network.failRequest": {
        "method": "network.failRequest",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-network-fail-request",
        "params": {
          "request": {
            "type": "network.Request",
            "required": true
          }
        },
        "placeholder": "{\n  \"request\": \"\"\n}"
      },
      "network.getData": {
        "method": "network.getData",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-network-get-data",
        "params": {
          "dataType": {
            "type": "network.DataType",
            "required": true
          },
          "collector": {
            "type": "network.Collector",
            "required": false
          },
          "disown": {
            "type": "bool .default false",
            "required": false
          },
          "request": {
            "type": "network.Request",
            "required": true
          }
        },
        "placeholder": "{\n  \"dataType\": {},\n  \"request\": \"\"\n}"
      },
      "network.provideResponse": {
        "method": "network.provideResponse",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-network-provide-response",
        "params": {
          "request": {
            "type": "network.Request",
            "required": true
          },
          "body": {
            "type": "network.BytesValue",
            "required": false
          },
          "cookies": {
            "type": "[*network.SetCookieHeader]",
            "required": false
          },
          "headers": {
            "type": "[*network.Header]",
            "required": false
          },
          "reasonPhrase": {
            "type": "text",
            "required": false
          },
          "statusCode": {
            "type": "js-uint",
            "required": false
          }
        },
        "placeholder": "{\n  \"request\": \"\"\n}"
      },
      "network.removeDataCollector": {
        "method": "network.removeDataCollector",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-network-remove-data-collector",
        "params": {
          "collector": {
            "type": "network.Collector",
            "required": true
          }
        },
        "placeholder": "{\n  \"collector\": {}\n}"
      },
      "network.removeIntercept": {
        "method": "network.removeIntercept",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-network-remove-intercept",
        "params": {
          "intercept": {
            "type": "network.Intercept",
            "required": true
          }
        },
        "placeholder": "{\n  \"intercept\": {}\n}"
      },
      "network.setCacheBehavior": {
        "method": "network.setCacheBehavior",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-network-set-cache-behavior",
        "params": {
          "cacheBehavior": {
            "type": "\"default\" | \"bypass\"",
            "required": true
          },
          "contexts": {
            "type": "[+browsingContext.BrowsingContext]",
            "required": false
          }
        },
        "placeholder": "{\n  \"cacheBehavior\": \"\"\n}"
      },
      "network.setExtraHeaders": {
        "method": "network.setExtraHeaders",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-network-set-extra-headers",
        "params": {
          "headers": {
            "type": "[*network.Header]",
            "required": true
          },
          "contexts": {
            "type": "[+browsingContext.BrowsingContext]",
            "required": false
          },
          "userContexts": {
            "type": "[+browser.UserContext]",
            "required": false
          }
        },
        "placeholder": "{\n  \"headers\": []\n}"
      }
    }
  },
  "script": {
    "commands": {
      "script.addPreloadScript": {
        "method": "script.addPreloadScript",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-script-add-preload-script",
        "params": {
          "functionDeclaration": {
            "type": "text",
            "required": true
          },
          "arguments": {
            "type": "[*script.ChannelValue]",
            "required": false
          },
          "contexts": {
            "type": "[+browsingContext.BrowsingContext]",
            "required": false
          },
          "userContexts": {
            "type": "[+browser.UserContext]",
            "required": false
          },
          "sandbox": {
            "type": "text",
            "required": false
          }
        },
        "placeholder": "{\n  \"functionDeclaration\": \"() => {}\"\n}"
      },
      "script.disown": {
        "method": "script.disown",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-script-disown",
        "params": {
          "handles": {
            "type": "[*script.Handle]",
            "required": true
          },
          "target": {
            "type": "script.Target;",
            "required": true
          }
        },
        "placeholder": "{\n  \"handles\": [],\n  \"target\": {\n    \"context\": \"\"\n  }\n}"
      },
      "script.callFunction": {
        "method": "script.callFunction",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-script-call-function",
        "params": {
          "functionDeclaration": {
            "type": "text",
            "required": true
          },
          "awaitPromise": {
            "type": "bool",
            "required": true
          },
          "target": {
            "type": "script.Target",
            "required": true
          },
          "arguments": {
            "type": "[*script.LocalValue]",
            "required": false
          },
          "resultOwnership": {
            "type": "script.ResultOwnership",
            "required": false
          },
          "serializationOptions": {
            "type": "script.SerializationOptions",
            "required": false
          },
          "this": {
            "type": "script.LocalValue",
            "required": false
          },
          "userActivation": {
            "type": "bool .default false",
            "required": false
          }
        },
        "placeholder": "{\n  \"functionDeclaration\": \"() => {}\",\n  \"awaitPromise\": false,\n  \"target\": {\n    \"context\": \"\"\n  }\n}"
      },
      "script.evaluate": {
        "method": "script.evaluate",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-script-evaluate",
        "params": {
          "expression": {
            "type": "text",
            "required": true
          },
          "target": {
            "type": "script.Target",
            "required": true
          },
          "awaitPromise": {
            "type": "bool",
            "required": true
          },
          "resultOwnership": {
            "type": "script.ResultOwnership",
            "required": false
          },
          "serializationOptions": {
            "type": "script.SerializationOptions",
            "required": false
          },
          "userActivation": {
            "type": "bool .default false",
            "required": false
          }
        },
        "placeholder": "{\n  \"expression\": \"\",\n  \"target\": {\n    \"context\": \"\"\n  },\n  \"awaitPromise\": false\n}"
      },
      "script.getRealms": {
        "method": "script.getRealms",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-script-get-realms",
        "params": {
          "context": {
            "type": "browsingContext.BrowsingContext",
            "required": false
          },
          "type": {
            "type": "script.RealmType",
            "required": false
          }
        },
        "placeholder": "{}"
      },
      "script.removePreloadScript": {
        "method": "script.removePreloadScript",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-script-remove-preload-script",
        "params": {
          "script": {
            "type": "script.PreloadScript",
            "required": true
          }
        },
        "placeholder": "{\n  \"script\": \"\"\n}"
      }
    }
  },
  "storage": {
    "commands": {
      "storage.getCookies": {
        "method": "storage.getCookies",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-storage-get-cookies",
        "params": {
          "filter": {
            "type": "storage.CookieFilter",
            "required": false
          },
          "partition": {
            "type": "storage.PartitionDescriptor",
            "required": false
          }
        },
        "placeholder": "{}"
      },
      "storage.setCookie": {
        "method": "storage.setCookie",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-storage-set-cookie",
        "params": {
          "cookie": {
            "type": "storage.PartialCookie",
            "required": true
          },
          "partition": {
            "type": "storage.PartitionDescriptor",
            "required": false
          }
        },
        "placeholder": "{\n  \"cookie\": {}\n}"
      },
      "storage.deleteCookies": {
        "method": "storage.deleteCookies",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-storage-delete-cookies",
        "params": {
          "filter": {
            "type": "storage.CookieFilter",
            "required": false
          },
          "partition": {
            "type": "storage.PartitionDescriptor",
            "required": false
          }
        },
        "placeholder": "{}"
      }
    }
  },
  "input": {
    "commands": {
      "input.performActions": {
        "method": "input.performActions",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-input-perform-actions",
        "params": {
          "context": {
            "type": "browsingContext.BrowsingContext",
            "required": true
          },
          "actions": {
            "type": "[*input.SourceActions]",
            "required": true
          }
        },
        "placeholder": "{\n  \"context\": \"\",\n  \"actions\": []\n}"
      },
      "input.releaseActions": {
        "method": "input.releaseActions",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-input-release-actions",
        "params": {
          "context": {
            "type": "browsingContext.BrowsingContext",
            "required": true
          }
        },
        "placeholder": "{\n  \"context\": \"\"\n}"
      },
      "input.setFiles": {
        "method": "input.setFiles",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-input-set-files",
        "params": {
          "context": {
            "type": "browsingContext.BrowsingContext",
            "required": true
          },
          "element": {
            "type": "script.SharedReference",
            "required": true
          },
          "files": {
            "type": "[*text]",
            "required": true
          }
        },
        "placeholder": "{\n  \"context\": \"\",\n  \"element\": {},\n  \"files\": \"\"\n}"
      },
      "input.fileDialogOpened": {
        "method": "input.fileDialogOpened",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-input-file-dialog-opened",
        "params": {},
        "placeholder": "{}"
      }
    }
  },
  "webExtension": {
    "commands": {
      "webExtension.install": {
        "method": "webExtension.install",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-webExtension-install",
        "params": {
          "extensionData": {
            "type": "webExtension.ExtensionData",
            "required": true
          }
        },
        "placeholder": "{\n  \"extensionData\": {}\n}"
      },
      "webExtension.uninstall": {
        "method": "webExtension.uninstall",
        "specUrl": "https://w3c.github.io/webdriver-bidi/#command-webExtension-uninstall",
        "params": {
          "extension": {
            "type": "webExtension.Extension",
            "required": true
          }
        },
        "placeholder": "{\n  \"extension\": {}\n}"
      }
    }
  }
};

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
