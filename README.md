# Introduction 
Mongoose OS running on a Sonoff (ESP-1) single channel wifi switch

# Getting Started

To configure the device with the correct wifi and MQTT broker credentials, add the correct conf#.json file where # is a number from 1-9 (see Mongoose OS configuration for more details) in the fs directory. 

You can also provide a device id in the configuration.  See the sample config file for an example

Build with
```mos build --clean```

To put the Sonoff in flash mode, hold in the push button before powering and the release after it has started.

Now flash with:
```mos flash```

A web UI to configure the settings is in the works.

# The software

There is three RPC handlers:

- SwitchOn
- SwitchOff
- SwitchToggle

that do what the name implies.  To call the RPC function, send a message on the topic: