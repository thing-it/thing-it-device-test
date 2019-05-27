module.exports = {
    metadata: {
        plugin: "testSensor",
        label: "Test Sensor",
        role: "sensor",
        family: "testSensor",
        deviceTypes: ["test/testDevice"],
        tangible: false,
        events: [{
            id: "manualGeneratedEvent",
            label: "Manual generated Event"
        }],
        services: [{
            id: "generateEvent",
            label: "Generate Event"
        }],
        configuration: [{
            id: 'submitRate',
            label: 'Submit Rate (ms)'
        }, {
            id: 'operationalStateInterval',
            label: 'Operational State Interval (ms)'
        }]
    },
    create: function () {
        return new TestSensor();
    }
};

/**
 *
 */
function TestSensor() {
    /**
     *
     */
    TestSensor.prototype.start = function () {
        // Register with Device

        this.device.registerSensor(this);

        setInterval(function () {
            this.publishStateChange({temperature: 15 + Math.ceil(Math.random() * 10)});

        }.bind(this), this.configuration && this.configuration.submitRate ? this.configuration.submitRate : 10000);

        this.operationalState.status = 'OK';

        setInterval(function () {
            if (this.operationalState.status === 'OK') {
                this.operationalState = {status: "ERROR", message: "Network connection lost"};
            } else if (this.operationalState.status === 'ERROR') {
                this.operationalState = {status: "PENDING", message: "Reconnecting"};
            } else if (this.operationalState.status === 'PENDING') {
                this.operationalState = {status: "OK", message: "Normal"};
            }

            this.publishOperationalStateChange();
        }.bind(this), this.configuration && this.configuration.operationalStateInterval ? this.configuration.operationalStateInterval : 30);
    };

    /**
     *
     */
    TestSensor.prototype.generateEvent = function () {
        this.publishEvent("manualGeneratedEvent");
    }

    /**
     *
     */
    TestSensor.prototype.getState = function () {
        return this.state;
    }
};
