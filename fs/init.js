load('api_config.js');
load('api_gpio.js');
load('api_sys.js');
load('api_timer.js');
load('api_rpc.js');
load('api_mqtt.js');

let led = Cfg.get('pins.led');
let button = Cfg.get('pins.button');
let relay = Cfg.get('pins.relay');

print('LED GPIO:', led, 'button GPIO:', button, "Relay:", relay);

GPIO.set_mode(relay, GPIO.MODE_OUTPUT);
GPIO.write(relay, 0);
let state = { "relay": 0 };  // device state

let getInfo = function() {
  return JSON.stringify({
    total_ram: Sys.total_ram(),
    free_ram: Sys.free_ram()
  });
};

RPC.addHandler("SwitchOff", function(args) {
  GPIO.write(relay, 0);
  state = { "relay": 0};
  print(JSON.stringify(state));
  return state;
});

RPC.addHandler("SwitchOn", function(args) {
  GPIO.write(relay, 1);
  state = { "relay": 1};
  print(JSON.stringify(state));
  return state;
});

RPC.addHandler("SwitchToggle", function(args) {
  let onoff = GPIO.toggle(relay);
  state = { "relay": onoff};
  print(JSON.stringify(state));
  return state;
});

// Blink built-in LED every 5 seconds
GPIO.set_mode(led, GPIO.MODE_OUTPUT);
Timer.set(5000 /* 5 sec */, true /* repeat */, function() {
  let value = GPIO.toggle(led);
  print(value ? 'Tick' : 'Tock', 'uptime:', Sys.uptime(), getInfo());
}, null);

Timer.set(10000 /* 10 sec */, false /* repeat */, function() {
  let dev_id = Cfg.get('device.id');
  let topic = dev_id + '/startup';
  let msg = JSON.stringify({ id: dev_id, 
    state: state});
  MQTT.pub(topic, msg);
  print(msg);
}, null);

// Toggle relay on button press. Button is wired to GPIO pin 0
GPIO.set_button_handler(button, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 200, function() {
    if (state["relay"]===1) {
      state["relay"]=0;
    } else if (state["relay"]===0) {
      state["relay"]=1;
    }
    GPIO.toggle(relay);
    print(JSON.stringify(state));
    return 1;
}, null);