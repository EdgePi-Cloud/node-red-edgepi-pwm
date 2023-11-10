module.exports = function(RED) {
    const rpc = require("@edgepi-cloud/edgepi-rpc")

    function PWMNode(config) {
        // Create node with user config
        RED.nodes.createNode(this, config);
        const node = this;
        const pwmPin = (config.pwmPin);
        const state = (config.state);
        const polarity = (config.polarity);
        const frequency = parseFloat(config.frequency);
        const dutyCycle = parseFloat(config.dutyCycle);

        if (pwm){
            console.debug("PWM node initialized on:", transport);
            node.status({fill:"green", shape:"ring", text:"PWM initialized"});
        }

        initializePWM(config).then(pwm => {
            node.on('input', async function (msg, send, done) {
                node.status({fill:"green", shape:"dot", text:"input recieved"});
                try{
                    // TODO: setting the input configurations... do this later when completing the pr for proper input
                    const { operation, pin, config } = msg.payload;
                    // other code for setting inputs. Switch between operations...
                    // ...
                    msg.payload = { status: 'Success', operation };
                }
                catch(err) {
                    console.error(err);
                    msg.payload = err;
                }
                // Send message payload
                send(msg);
                if (done) {
                    done();
                }
            })

            // handle exit
            node.on("close", function(done) {
                node.status({fill:"grey", shape:"ring", text:"PWM terminated"});

                done();
            });
        }).catch(error) {
            // TODO: handle initialization error
            node.status({fill:"red", shape:"ring", text:"Initialization error"});
        }
    }
    RED.nodes.registerType("pwm", PWMNode);

}