# <img src="./images/logo-simple-bar-server.png" width="200" alt="simple-bar-server" />

A server for [simple-bar](https://www.jeantinland.com/en/toolbox/simple-bar) that enables communication with it by requesting simple-bar' data widgets refreshes or toggling with simple `curl` commands.

## Status

This project is ready to be used but only work with the latest version of [simple-bar](https://github.com/Jean-Tinland/simple-bar).

I will continue to maintain it and add new features like the refreshing of spaces & process widgets allowing to avoid the use of applescript notification system to refresh simple-bar thus improve its responsiveness.

## Dependencies

In order to run this project, you will need to install globally the following dependencies:

- node >=18.11.0
- npm
- pm2 >=5.3.0

## Installation

```bash
# Install dependencies
npm install

# Run the server
npm run start

# Register the server to be run at startup
# pm2 will ask you to run a command as sudo to register it ("sudo env PATH=...")
pm2 startup

# Save the current pm2 configuration
pm2 save
```

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

### Widgets refresh

You can request simple-bar to refresh or toggle its widgets by sending a `GET` request to the `/refresh` endpoint.

Examples:

```bash
# Force time widget refresh
curl http://localhost:7776/time/refresh

# Toggle time widget visibility
curl http://localhost:7776/time/toggle

# Force the user widget n°1 to refresh
curl http://localhost:7776/user-widget/refresh/1

# Toggle the user widget n°1 visibility
curl http://localhost:7776/user-widget/toggle/1
```

Widget list:

- "battery"
- "browser-track"
- "cpu"
- "crypto"
- "date-display"
- "keyboard"
- "mic"
- "mpd"
- "music"
- "netstats"
- "sound"
- "spotify"
- "stock"
- "time"
- "viscosity-vpn"
- "weather"
- "wifi"
- "zoom"
