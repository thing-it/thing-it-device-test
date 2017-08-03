module.exports = {
    metadata: {
        plugin: "testSensor",
        label: "Test Sensor",
        role: "sensor",
        family: "testSensor",
        deviceTypes: ["test/testDevice"],
        configuration: [{
            label: "Pin",
            id: "pin",
            type: {
                family: "reference",
                id: "digitalInOutPin"
            },
            defaultValue: "12"
        }, {
            label: "Holdtime",
            id: "holdtime",
            type: {
                id: "integer"
            },
            defaultValue: 500,
            unit: "ms"
        }, {
            label: "Send Click Events",
            id: "sendClickEvents",
            type: {
                id: "boolean"
            },
            defaultValue: true
        }, {
            label: "Send Down Events",
            id: "sendDownEvents",
            type: {
                id: "boolean"
            },
            defaultValue: false
        }, {
            label: "Send Hold Events",
            id: "sendHoldEvents",
            type: {
                id: "boolean"
            },
            defaultValue: false
        }, {
            label: "Holdtime",
            id: "holdtime",
            type: {
                id: "integer"
            },
            defaultValue: 500,
            unit: "ms"
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
    };
};