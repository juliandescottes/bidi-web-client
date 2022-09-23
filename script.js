"use strict";

let socket;

document.querySelector("#connect").addEventListener("click", () => {
  const domain = document.querySelector("#host").value;
  socket = new WebSocket(`ws://${domain}/session`);
  socket.onmessage = onWebSocketMessage;
  socket.onopen = function (event) {
    document.querySelector("#connect").setAttribute("disabled", "true");
    document.querySelector("#host").setAttribute("disabled", "true");
    document.querySelector("#connect").innerText = "connected";    
    addTraffic("ws", "WebSocket open");
  };  
  socket.onclose = function (event) {
    document.querySelector("#connect").removeAttribute("disabled");
    document.querySelector("#host").removeAttribute("disabled");
    document.querySelector("#connect").innerText = "connect";    
    addTraffic("ws", "WebSocket closed");
  };
});

let customCommandId = 1;
const commandMarkup = `
  <span class="command-info">method</span>
  <input type="text" name="method" placeholder="">
  <span class="command-info">params</span>
  <input type="text" name="params" placeholder='{ key: "value" }'>
  <button class="command-send">send</button>`;

document.querySelector("#add-command-button").addEventListener("click", () => {
  const commandEl = document.createElement("div");
  commandEl.className = "command";
  commandEl.dataset.command = "CUSTOM" + customCommandId;
  customCommandId++;
  commandEl.innerHTML = commandMarkup;
  
  document.querySelector("#commands-container").appendChild(commandEl);
});

let reqId = 1;

window.sendCommand = async function (method, params) {
  const id = await sendMessage({ method, params });
  return new Promise(resolve => {
    const removeListener = addWSMessageListener(data => { 
      if (data.id === id) {
        removeListener();
        resolve(data);
      }
    })
  });
}

const wsMessageListeners = new Set();
const addWSMessageListener = function (cb) {
  wsMessageListeners.add(cb);
  return () => wsMessageListeners.delete(cb);
}

document.querySelector("#commands-container").addEventListener("click", async e => {
  if (!e.target.classList.contains("command-send")) {
    return;  
  }
  
  const commandEl = e.target.closest(".command");
  if (!commandEl) {
    return;
  }

  const params = commandEl.querySelector("input[name=params]").value || "{}";
  if (commandEl.dataset.command.startsWith("CUSTOM")) {
    await sendMessage({
      "method": commandEl.querySelector("input[name=method]").value,
      "params": eval(`(${params})`),
    });
  } else {
    await sendMessage({
      "method": commandEl.dataset.command,
      "params": eval(`(${params})`),
    });
  }
})
document.querySelector("#requests-log").addEventListener("click", async e => {
  if (!e.target.classList.contains("log-id")) {
    return;  
  }
  
  const requestEl = e.target.closest(".request");
  if (!requestEl) {
    return;
  }
  
  requestEl.classList.toggle("expanded");
})

function onWebSocketMessage(event) {
  console.log(event.data);
  const data = JSON.parse(event.data);
  if (data.id) {
    addTraffic("response", data);
    wsMessageListeners.forEach(cb => cb(data));
  } else {
    addTraffic("event", data);
    if (isLogEvent(data)) {
      addLogEvent(data);
    }
  }
}

async function sendMessage(msg) {
  const id = reqId++;
  msg.id = id;
  addTraffic("request", msg);
  socket.send(JSON.stringify(msg));
  return id;
}

function logTemplate(type, id) {
  return `<div class="log ${type}">
    <span class=log-id title="click to expand/collapse">${id}</span>
    <span class=log-text></span>
  </div>`;
}

function eventTemplate(type, id, text, time) {
  return `<div class="log ${type}">
    <span class=log-id>${id}</span>
    <span class=log-text>${text}</span>
    <span class=log-time>${time}</span>
  </div>`;
}

const nodeBuilder = document.createElement("div")

let fakeRequest = document.querySelector("#fake-request");
let fakeEvent = document.querySelector("#fake-event");

function addTraffic(id, msg) {
  document.querySelector("#fake-request")?.remove();
  nodeBuilder.innerHTML = logTemplate("request", id);
  nodeBuilder.querySelector(".log-text").textContent = JSON.stringify(msg, null, "  ");
  const container = document.querySelector("#requests-log");
  if (!container.firstChild) {
    container.appendChild(nodeBuilder.firstChild);
  } else {
    container.insertBefore(nodeBuilder.firstChild, container.firstChild);
  }
}

function isLogEvent(data) {
  const evt = data.params;
  return !!evt.method;
}

function addLogEvent(data) {
  document.querySelector("#fake-event")?.remove();
  const evt = data.params;
  const time = new Date(evt.timestamp).toTimeString().substring(0, 8)

  nodeBuilder.innerHTML = eventTemplate("event", evt.method, evt.text, time);
  const container = document.querySelector("#events-log");
  if (!container.firstChild) {
    container.appendChild(nodeBuilder.firstChild);
  } else {
    container.insertBefore(nodeBuilder.firstChild, container.firstChild);
  }
}

function clearRequests() {
  const container = document.querySelector("#requests-log");
  container.innerHTML = "";
  container.appendChild(fakeRequest);
}

function clearEvents() {
  const container = document.querySelector("#events-log");
  container.innerHTML = "";
  container.appendChild(fakeEvent);
}

[...document.querySelectorAll(".clear-button")].forEach(btn => btn.addEventListener("click", e => {
  const container = e.target.dataset.container;
  if (container === "requests") {
    clearRequests();
  }  
  if (container === "events") {
    clearEvents();
  }
}));

console.log(`Hi! 

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
`);