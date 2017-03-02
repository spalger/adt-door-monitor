# adt-door-monitor

Periodically check the ADT Pulse dashboard for the status of doors in your house. Send an SMS when the status changes.

# setup
 - copy `.env.default` to `.env` and fill out the missing values
 - run `npm run build && npm run start` to run locally
 - run `npm run deploy` to deploy to your current docker host
   - use `npm run logs` to see the log output from the container

# todo
 - only alert when the door has been open for X minutes
 - commands via SMS response
   - ignore door
   - mute alerts for time
   - mute alerts until closed