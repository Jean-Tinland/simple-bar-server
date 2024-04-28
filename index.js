import http from "http";
import { WebSocketServer } from "ws";
import { exec } from "child_process";
import config from "./config.json" assert { type: "json" };
import widgetAction from "./services/widget.js";
import yabaiAction from "./services/yabai.js";
import skhdAction from "./services/skhd.js";
import * as DATA from "./data.js";

process.title = "simple-bar-server";

const wss = new WebSocketServer({ port: config.ports.ws });

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });

  const [realm, kind, action, userWidgetIndex] = req.url.split("/").slice(1);

  if (!realm) {
    res.statusCode = 400;
    res.end(`Missing realm name (${DATA.REALMS.join(", ")}).`);
    return;
  }

  if (!DATA.REALMS.includes(realm)) {
    res.statusCode = 400;
    res.end(`Unknown realm "${realm}".`);
    return;
  }

  if (realm === "widget") {
    widgetAction(res, wss.clients, kind, action, userWidgetIndex);
  }

  if (realm === "yabai") {
    yabaiAction(res, wss.clients, kind, action);
  }

  if (realm === "skhd") {
    skhdAction(res, wss.clients, kind, action);
  }

  res.end();
});

server.listen(config.ports.http, "127.0.0.1");

server.on("listening", () => {
  console.log(
    `simple-bar-server running at http://localhost:${config.ports.http}`
  );
  exec(`osascript -e 'tell application id "tracesOf.Uebersicht" to refresh'`);
});

wss.on("connection", (ws, req) => {
  const url = new URL(req.url, "http://localhost");
  const target = url.searchParams.get("target");
  const userWidgetIndex = url.searchParams.get("userWidgetIndex");

  if (!target) {
    ws.close();
    return;
  }

  Object.assign(ws, { target, userWidgetIndex });
});
