# node-red-edgepi-pwm

Node-Red node for EdgePi PWM

Configures a PWM port on the EdgePi.

### Properties

- **RPC Server**:
  The connection to your EdgePi's RPC Server.
- **PWM**:
  The PWM Pin to configure on the EdgePi.
- **State**:
  Whether the PWM Pin is enabled or disabled.
- **Polarity**:
  Determines the signal's resting state (high or low).
- **Frequency**:
  Rate at which the PWM completes a cycle.
- **Duty Cycle**:
  Percentage of one cycle in which a signal is active.

### Inputs

- **msg.payload** `number`:
  The duty cycle.
- **msg.frequency** `number`
- **msg.polarity** `string`
- **msg.enabled** `boolean`

Example input configuration:

```
msg {
  "payload": 0,
  "frequency": 1000,
  "polarity": "NORMAL",
  "enabled": false
}
```

### Outputs

Values of successfully configured properties.

- **msg.payload** `number`:
  Either the duty cycle or an error message in an error case.
- **msg.pwmPin** `string`
- **msg.frequency** `number`
- **msg.polarity** `string`
- **msg.enabled** `boolean`

Example output:

```
msg {
  "payload": 0,
  "pwmPin": "PWM1",
  "frequency": 1000,
  "polarity": "NORMAL",
  "enabled": false
}
```
