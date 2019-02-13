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
            label: 'Submit Rate in ms'
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
    };

    /**
     *
     */
    TestSensor.prototype.generateEvent = function () {
        this.publishEvent("manualGeneratedEvent");
    }
};