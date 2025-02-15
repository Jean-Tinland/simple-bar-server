import http from "http";
import { WebSocketServer } from "ws";
import { exec } from "child_process";
import config from "./config.js";
import widgetAction from "./services/widget.js";
import yabaiAction from "./services/yabai.js";
import skhdAction from "./services/skhd.js";
import aerospaceAction from "./services/aerospace.js";
import flashspaceAction from "./services/flashspace.js";
import missiveAction from "./services/missive.js";
import * as DATA from "./data.js";

process.title = "simple-bar-server";

const wssServer = http.createServer();
wssServer.listen(config.ports.ws, "127.0.0.1");

const wss = new WebSocketServer({ server: wssServer });

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });

  const url = new URL(req.url, "http://localhost");
  const urlSegments = url.pathname.split("/").slice(1);
  const [realm, kind, action, userWidgetIndex] = urlSegments;

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

  if (realm === "aerospace") {
    aerospaceAction(res, wss.clients, kind, action);
  }

  if (realm === "flashspace") {
    flashspaceAction(res, wss.clients, kind, action);
  }

  if (realm === "missive") {
    missiveAction(req, res, wss.clients, kind);
  }

  res.end();
});

server.listen(config.ports.http, "127.0.0.1");

server.on("listening", () => {
  console.info(
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
