import http from "http";
import { WebSocketServer } from "ws";
import config from "./config.json" assert { type: "json" };

process.title = "simple-bar-server";

const WIDGETS = [
  "battery",
  "browser-track",
  "crypto",
  "date-display",
  "keyboard",
  "mic",
  "mpd",
  "music",
  "netstats",
  "sound",
  "spotify",
  "stock",
  "time",
  "user-widget",
  "viscosity-vpn",
  "weather",
  "wifi",
  "zoom",
];

const ACTIONS = ["toggle", "refresh"];

const wss = new WebSocketServer({ port: config.ports.ws });

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });

  const [widget, action, userWidgetIndex] = req.url.split("/").slice(1);

  if (!widget) {
    res.statusCode = 400;
    res.end("Missing widget name.");
    return;
  }

  if (!WIDGETS.includes(widget)) {
    res.statusCode = 400;
    res.end(`Unknown widget "${widget}".`);
    return;
  }

  if (!action) {
    res.statusCode = 400;
    res.end("You need to specify an action (toggle or refresh).");
    return;
  }

  if (!ACTIONS.includes(action)) {
    res.statusCode = 400;
    res.end(`Unknown action "${action}".`);
    return;
  }

  for (const client of wss.clients) {
    if (
      widget === client.widget &&
      (!userWidgetIndex || client.userWidgetIndex === userWidgetIndex)
    ) {
      client.send(JSON.stringify({ action }));
    }
  }
  res.end();
});

server.listen(config.ports.http, "127.0.0.1");

wss.on("connection", (ws, req) => {
  const url = new URL(req.url, "http://localhost");
  const widget = url.searchParams.get("widget");
  const userWidgetIndex = url.searchParams.get("userWidgetIndex");

  if (!widget) {
    ws.close();
    return;
  }

  console.log(`New widget connected: "${widget}".`);

  Object.assign(ws, { widget, userWidgetIndex });

  ws.on("close", () => {
    console.log(`Widget "${widget}" disconnected.`);
  });
});
