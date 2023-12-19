module.exports = function (RED) {
  const rpc = require("@edgepi-cloud/edgepi-rpc");

  function PWMNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const pwmPin = rpc.PWMPins[config.pwmPin];

    setInitialConfigs(config)
      .then((pwm) => {
        node.on("input", async function (msg, send, done) {
          node.status({ fill: "green", shape: "dot", text: "input received" });
          try {
            await updateConfigsOnInput(msg, pwm, config);
            msg = {
              payload: await pwm.getDutyCycle(pwmPin),
              pwmPin: pwmPin,
              frequency: await pwm.getFrequency(pwmPin),
              polarity: await pwm.getPolarity(pwmPin),
              enabled: await pwm.getEnabled(pwmPin),
            };
          } catch (error) {
            console.error(error);
            msg.payload = error;
          }
          send(msg);
          if (done) done();
        });

        node.on("close", async () => {
          try {
            await pwm.close(pwmPin);
          } catch (error) {
            console.error(error);
          }
        });
      })
      .catch((error) => {
        console.error(error);
        node.status({
          fill: "red",
          shape: "ring",
          text: "Initialization error",
        });
      });

    async function setInitialConfigs(config) {
      const transport =
        config.transport === "Network"
          ? `tcp://${config.tcpAddress}:${config.tcpPort}`
          : "ipc:///tmp/edgepi.pipe";
      const configArg = {
        pwmNum: config.pwmPin,
        frequency: parseFloat(config.frequency),
        dutyCycle: parseFloat(config.dutyCycle) / 100,
        polarity: config.polarity,
      };

      try {
        const pwm = new rpc.PWMService(transport);
        console.info("PWM node initialized on:", transport);
        await pwm.initPwm(pwmPin);
        await pwm.setConfig(configArg);
        if (config.state === "enabled") {
          await pwm.enable(pwmPin);
        } else {
          await pwm.disable(pwmPin);
        }
        return pwm;
      } catch (error) {
        error.message =
          "Error setting initial configurations: " + error.message;
        throw error;
      }
    }

    async function updateConfigsOnInput(msg, pwm) {
      let inputConfig = { pwmNum: pwmPin };
      const { frequency, payload, polarity, enabled } = msg;

      if (enabled === false) {
        await pwm.disable(pwmPin);
      } else {
        if (payload) {
          inputConfig.dutyCycle = parseFloat(payload) / 100;
        }
        if (frequency) {
          inputConfig.frequency = parseFloat(frequency);
        }
        if (polarity) {
          inputConfig.polarity = rpc.Polarity[polarity];
        }
        // If setConfig fails, reinitialize and try again
        const maxRetries = 3;
        let attempt = 0;
        while (attempt < maxRetries) {
          try {
            await pwm.setConfig(inputConfig);
            break;
          } catch (error) {
            attempt++;
            if (attempt >= maxRetries) throw error;
            await pwm.initPwm(pwmPin);
          }
        }
        if (enabled === true) {
          await pwm.enable(pwmPin);
        }
      }
    }
  }

  RED.nodes.registerType("pwm", PWMNode);
};
