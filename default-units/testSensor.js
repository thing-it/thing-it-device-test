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
        configuration: []
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
    };

    /**
     *
     */
    TestSensor.prototype.generateEvent = function () {
        this.publishEvent("manualGeneratedEvent");
    }
};