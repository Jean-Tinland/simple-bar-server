import Queue from "../utils/queue.js";
import * as DATA from "../data.js";

const queues = {
  config: new Queue(),
  workspace: new Queue(),
};

export default function flashspaceAction(res, clients, kind, action) {
  if (!kind) {
    res.statusCode = 400;
    res.end("Missing kind name.");
    return;
  }

  if (!DATA.FLASHSPACE.includes(kind)) {
    res.statusCode = 400;
    res.end(`Unknown kind "${kind}".`);
    return;
  }

  if (!action) {
    res.statusCode = 400;
    res.end(
      `You need to specify an action (${DATA.FLASHSPACE_ACTIONS.join(", ")}).`
    );
    return;
  }

  if (!DATA.FLASHSPACE_ACTIONS.includes(action)) {
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
