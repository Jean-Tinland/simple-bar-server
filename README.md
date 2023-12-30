# <img src="./images/logo-simple-bar-server.png" width="200" alt="simple-bar-server" />

A server for [simple-bar](https://github.com/Jean-Tinland/simple-bar) that enables communication with its data widgets and allow them to be refreshed or toggled with simple `curl` commands.

It is an ultra small node.js http server opening a websocket connection with [simple-bar](https://github.com/Jean-Tinland/simple-bar). Check `index.js` file to see how it works.

## Status

This project is ready to be used but only work with the latest version of [simple-bar](https://github.com/Jean-Tinland/simple-bar). It is a really fresh project so feel free to open an issue if you find a bug or have a feature request.

> As it is a young project, some features may be subject to change.

I plan to maintain it and add new features like the refreshing of spaces & process widgets allowing to avoid the use of applescript notification system to refresh simple-bar thus improve its responsiveness.

## Dependencies

In order to run this project, you will need to install globally the following dependencies:

- **node >=18.11.0**
- **npm**
- **pm2 >=5.3.0**

## Installation

Clone this project anywhere on your computer:

```bash
git clone https://github.com/Jean-Tinland/simple-bar-server.git
```

Then, go to the project folder and run the following commands:

```bash
# Install local dependencies
npm install

# Run the server
npm run start

# Register the server to be run at startup
# pm2 will ask you to run a command as sudo to register it ("sudo env PATH=...")
pm2 startup

# Save the current pm2 configuration
pm2 save
```

> On the first run, node will ask for Übersicht control permissions. You need to allow it to be able to refresh simple-bar automatically on simple-bar-server restart.

## Configuration

The server can be configured by editing the `config.json` file in which you can set the ports for both the server and the websocket.

```json
{
  "ports": {
    "http": 7776,
    "ws": 7777
  }
}
```

## Usage

You can request simple-bar to refresh or toggle its widgets by sending a `GET` request to the server.

A request is composed of the following parts:

```bash
# Toggle or refresh a widget
curl http://localhost:7776/<realm>/<target>/<action>
```

`realm` is either `widget`, `yabai` or `missive`. Only the `widget` realm is currently supported.

### Widgets

When using the `widget` realm, `target` is the name of the widget you want to refresh or toggle (see the list below for allowed widget names) and `action` is the action you want to perform on it (allowed actions are `refresh` or `toggle`).

Here is the list of the available widgets:

- `battery`
- `browser-track`
- `cpu`
- `crypto`
- `date-display`
- `keyboard`
- `mic`
- `mpd`
- `music`
- `netstats`
- `sound`
- `spotify`
- `stock`
- `time`
- `viscosity-vpn`
- `weather`
- `wifi`
- `zoom`

For the user widgets, the request is composed of the following parts:

```bash
# Toggle or refresh a user widget
curl http://localhost:7776/<realm>/user-widget/<action>/<id>
```

`id` is the number of the widget displayed in each custom user widget in the settings module (it is based on their order).

Examples:

```bash
# Force time widget refresh
curl http://localhost:7776/widget/time/refresh

# Toggle time widget visibility
curl http://localhost:7776/widget/time/toggle

# Force the user widget n°1 to refresh
curl http://localhost:7776/widget/user-widget/refresh/1

# Toggle the user widget n°1 visibility
curl http://localhost:7776/widget/user-widget/toggle/1
```

### Yabai

> Not implemented yet

When using the `yabai` realm, `target` is the name of the target you want to refresh (see the list below for allowed targets) and `action` is the action you want to perform on it (the only allowed action is `refresh`).

Here is the list of the available targets:

- `spaces`
- `windows`
- `displays`

### Missive

> Not implemented yet

Description coming soon...
