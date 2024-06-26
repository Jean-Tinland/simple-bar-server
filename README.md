# <img src="./images/logo-simple-bar-server.png" width="200" alt="simple-bar-server" />

A server for [simple-bar](https://github.com/Jean-Tinland/simple-bar) that enables communication with its data widgets and allow them to be refreshed or toggled with simple `curl` commands.

> [!NOTE]
> There are no external call to any API, it is just a local small node.js server on which [simple-bar](https://github.com/Jean-Tinland/simple-bar)'s components will be able to connect to via websockets.
> Check `index.js` file to see how it works.

## Status

This project is ready to be used but only work with the latest version of [simple-bar](https://github.com/Jean-Tinland/simple-bar). It is a really fresh project so feel free to open an issue if you find a bug or have a feature request.

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

The server can be configured by editing the `config.js` file in which you can set the ports for both the server and the websocket.

```js
const config = {
  ports: {
    http: 7776,
    ws: 7777,
  },
};

export default config;
```

> [!IMPORTANT]
> Adapt the port number in the examples below if you changed it in the config file.

## Usage

> [!IMPORTANT]
> First, you'll need to enable the websocket connection in `simple-bar`: [see "Enable simple-bar-server connection" and "Refresh spaces & process with simple-bar-server" in "Setup" section](https://www.jeantinland.com/en/toolbox/simple-bar/documentation/global-settings/).

You can request simple-bar to refresh or toggle its widgets by sending a `GET` request to the server.

A request is composed of the following parts:

```bash
# Toggle or refresh a widget
curl http://localhost:7776/<realm>/<target>/<action>
```

`realm` is either `widget`, `yabai`, `skhd` or `missive`. Only the `widget` realm is currently supported.

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

When using the `yabai` realm, `target` is the name of the target you want to refresh (see the list below for allowed targets) and `action` is the action you want to perform on it (the only allowed action is `refresh`).

Here is the list of the available targets:

- `spaces`
- `windows`
- `displays`

Examples:

```bash
# Force spaces widget refresh
curl http://localhost:7776/yabai/spaces/refresh

# Force windows widget refresh
curl http://localhost:7776/yabai/windows/refresh

# Force displays widget refresh
curl http://localhost:7776/yabai/displays/refresh
```

If you want to sync theses refresh with yabai signals, put the following lines in your yabai config file (`.yabairc`):

```bash
yabai -m signal --add event=window_focused action="curl http://localhost:7776/yabai/spaces/refresh && curl http://localhost:7776/yabai/windows/refresh" label="Refresh simple-bar spaces & windows when focused application changes"
yabai -m signal --add event=window_resized action="curl http://localhost:7776/yabai/spaces/refresh && curl http://localhost:7776/yabai/windows/refresh" label="Refresh simple-bar spaces & windows when a window is resized"
yabai -m signal --add event=window_destroyed action="curl http://localhost:7776/yabai/spaces/refresh && curl http://localhost:7776/yabai/windows/refresh" label="Refresh simple-ba spaces & windows when an application window is closed"
yabai -m signal --add event=space_changed action="curl http://localhost:7776/yabai/spaces/refresh && curl http://localhost:7776/yabai/windows/refresh" label="Refresh simple-bar spaces & windows on space change"
yabai -m signal --add event=display_changed action="curl http://localhost:7776/yabai/spaces/refresh && curl http://localhost:7776/yabai/windows/refresh" label="Refresh simple-bar spaces & windows on display focus change"
yabai -m signal --add event=window_title_changed action="curl http://localhost:7776/yabai/spaces/refresh && curl http://localhost:7776/yabai/windows/refresh" label="Refresh simple-bar spaces & windows when current window title changes"
yabai -m signal --add event=space_destroyed action="curl http://localhost:7776/yabai/spaces/refresh && curl http://localhost:7776/yabai/windows/refresh" label="Refresh simple-bar spaces & windows on space removal"
yabai -m signal --add event=space_created action="curl http://localhost:7776/yabai/spaces/refresh && curl http://localhost:7776/yabai/windows/refresh" label="Refresh simple-bar spaces & windows on space creation"
yabai -m signal --add event=application_activated action="curl http://localhost:7776/yabai/spaces/refresh && curl http://localhost:7776/yabai/windows/refresh" label="Refresh simple-bar spaces & windows when application is activated"
yabai -m signal --add event=display_added action="curl http://localhost:7776/yabai/displays/refresh" label="Refresh simple-bar displays when a new dispay is added"
yabai -m signal --add event=display_removed action="curl http://localhost:7776/yabai/displays/refresh" label="Refresh simple-bar displays when a dispay is removed"
yabai -m signal --add event=display_moved action="curl http://localhost:7776/yabai/displays/refresh" label="Refresh simple-bar displays when a dispay is moved"
```

> [!NOTE]
> Adapt the port number if you changed it in the config file.

Events overlapping is not an issue as the server will queue consecutive refreshes requested by `yabai` signals in order to prevent multiple useless re-renders..

### skhd

When using the `skhd` realm, `target` is the name of the target you want to refresh (see the list below for allowed targets) and `action` is the action you want to perform on it (the only allowed action is `refresh`).

Here is the list of the available targets:

- `mode`

Examples:

```bash
# Force skhd mode indicator refresh
curl http://localhost:7776/skhd/mode/refresh
```

### Missive

> Not implemented yet

Description coming soon...
