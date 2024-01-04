import Queue from "../utils/queue.js";
import * as DATA from "../data.js";

const queues = {
  spaces: new Queue(),
  windows: new Queue(),
  displays: new Queue(),
};

export default function yabaiAction(res, clients, kind, action) {
  if (!kind) {
    res.statusCode = 400;
    res.end("Missing kind name.");
    return;
  }

  if (!DATA.YABAI.includes(kind)) {
    res.statusCode = 400;
    res.end(`Unknown kind "${kind}".`);
    return;
  }

  if (!action) {
    res.statusCode = 400;
    res.end(
      `You need to specify an action (${DATA.YABAI_ACTIONS.join(", ")}).`
    );
    return;
  }

  if (!DATA.YABAI_ACTIONS.includes(action)) {
    res.statusCode = 400;
    res.end(`Unknown action "${action}".`);
    return;
  }

  queues[kind].enqueue(action);

  setTimeout(() => {
    for (const client of clients) {
      const isTargetedWidget = client.target === kind;

      if (isTargetedWidget) {
        const lastAction = queues[kind].peek();
        if (lastAction) {
          client.send(JSON.stringify({ action: lastAction }));
        }
      }
    }

    queues[kind].empty();
  }, 20);
}
