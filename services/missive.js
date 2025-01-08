import * as DATA from "../data.js";

export default function missiveAction(req, res, clients, action) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method Not Allowed.");
    return;
  }

  if (!action) {
    res.statusCode = 400;
    res.end(
      `You need to specify an action (${DATA.MISSIVE_ACTIONS.join(", ")}).`
    );
    return;
  }

  if (!DATA.MISSIVE_ACTIONS.includes(action)) {
    res.statusCode = 400;
    res.end(`Unknown action "${action}".`);
    return;
  }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const json = JSON.parse(body);
      if (!json.content) {
        res.statusCode = 400;
        res.end("Missing content.");
        return;
      }

      for (const client of clients) {
        const isTargetedWidget = client.target === "missive";

        if (isTargetedWidget) {
          client.send(JSON.stringify({ action, data: json }));
        }
      }
    } catch (error) {
      res.statusCode = 400;
      res.end("Invalid JSON.");
      return;
    }
  });
}
