import * as DATA from "../data.js";

export default function skhdAction(res, clients, kind, action) {
  if (!kind) {
    res.statusCode = 400;
    res.end("Missing kind name.");
    return;
  }

  if (!DATA.SKHD.includes(kind)) {
    res.statusCode = 400;
    res.end(`Unknown kind "${kind}".`);
    return;
  }

  if (!action) {
    res.statusCode = 400;
    res.end(`You need to specify an action (${DATA.SKHD_ACTIONS.join(", ")}).`);
    return;
  }

  if (!DATA.SKHD_ACTIONS.includes(action)) {
    res.statusCode = 400;
    res.end(`Unknown action "${action}".`);
    return;
  }

  for (const client of clients) {
    const isTargetedWidget = client.target === kind;

    if (isTargetedWidget) {
      client.send(JSON.stringify({ action }));
    }
  }
}
