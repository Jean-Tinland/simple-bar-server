import * as DATA from "../data.js";

export default function widgetAction(
  res,
  clients,
  kind,
  action,
  userWidgetIndex
) {
  if (!kind) {
    res.statusCode = 400;
    res.end("Missing kind name.");
    return;
  }

  if (!DATA.WIDGETS.includes(kind)) {
    res.statusCode = 400;
    res.end(`Unknown kind "${kind}".`);
    return;
  }

  if (!action) {
    res.statusCode = 400;
    res.end(
      `You need to specify an action (${DATA.WIDGET_ACTIONS.join(", ")}).`
    );
    return;
  }

  if (!DATA.WIDGET_ACTIONS.includes(action)) {
    res.statusCode = 400;
    res.end(`Unknown action "${action}".`);
    return;
  }

  for (const client of clients) {
    const isTargetedWidget = client.target === kind;

    const isTargetedUserWidget =
      !userWidgetIndex || client.userWidgetIndex === userWidgetIndex;

    const isValidTarget = isTargetedWidget && isTargetedUserWidget;

    if (isValidTarget) {
      client.send(JSON.stringify({ action }));
    }
  }
}
