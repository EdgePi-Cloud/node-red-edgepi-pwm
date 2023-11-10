const rpc = require("@edgepi-cloud/edgepi-rpc");

async function initializePWM(config) {
  try {
    // Configure and initialize the PWM service
      const transport =
        config.transport === "Network"
          ? `tcp://${config.tcpAddress}:${config.tcpPort}`
          : "ipc:///tmp/edgepi.pipe";
      const pwm = new rpc.PWMService(transport);
      await pwm.initPwm(config.pwmPin);

      // Set config
      const configArg = {
        pwm_num: config.pwmPin,
        frequency: parseFloat(config.frequency),
        duty_cycle: parseFloat(config.dutyCycle),
        polarity: config.polarity,
      };
      await pwm.setConfig(configArg);

      // Enable or disable
      if (config.state === "enable") {
        await pwm.enable(config.pwmPin);
      } else {
        await pwm.disable(config.pwmPin);
      }

      console.debug("PWM node initialized on:", transport);
      node.status({ fill: "green", shape: "ring", text: "PWM initialized" });
      return pwm;
  } catch (error) {
    console.error("Initialization error:", error);
    node.status({ fill: "red", shape: "ring", text: "Initialization error" });
    throw error; // Rethrow to prevent further execution
  }
}

module.exports = initializePWM;
