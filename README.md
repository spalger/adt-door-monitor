# adt-door-monitor

For people with ADT's "Pulse" alarm system.

Monitors the status of the doors in your home and sends an SMS when the they are open for some period of time.

# setup
 - copy `.env.default` to `.env` and fill out the missing values
 - run `npm run build && npm run start` to run locally
 - run `npm run deploy` to deploy to your current docker host
   - use `npm run logs` to see the log output from the container

# todo
 - [x] only alert when the door has been open for X minutes
 - commands via SMS response
   - ignore door
   - mute alerts for time
   - mute alerts until closed