var singleton = {
    prefix: '',
    devices: [],
    actors: [],
    sensors: [],
    metadata: {
        family: "testDevice",
        plugin: "testDevice",
        label: "Test Device",
        tangible: false,
        connectionTypes: [],
        dataTypes: {},
        actorTypes: [],
        sensorTypes: [],
        services: [],
        configuration: []
    },
    create: function (device) {
        return new TestDevice();
    },
    setPrefix: function (prefix) {
        this.prefix = prefix;
    },
    getDevice: function (id) {
        return this.devices.find(function (element) {
            return element.id === this.prefix + id;
        }.bind(this));
    },
    getActor: function (deviceId, id) {
        var device = this.getDevice(deviceId);

        return device.actors.find(function (element) {
            return element.id === id;
        });
    },
    getSensor: function (deviceId, id) {
        var device = this.getDevice(deviceId);

        return device.sensors.find(function (element) {
            return element.id === id;
        });
    }
};

module.exports = singleton;

const q = require('q');
var _ = require('lodash');

function TestDevice() {
    TestDevice.prototype.initialize = function (module) {

        return this;
    };

    TestDevice.prototype.start = function () {
        singleton.devices.push(this);

        return q.resolve();
    };

    TestDevice.prototype.registerActor = function (actor) {
        singleton.actors.push(actor);
    };

    TestDevice.prototype.registerSensor = function (sensor) {
        singleton.sensors.push(sensor);
    };

    TestDevice.prototype.getState = function () {
        return this.state;
    };

    TestDevice.prototype.setState = function (state) {
        this.state = state;

        this.publishStateChange();
    };

    TestDevice.prototype.stop = function () {
        return q.resolve();
    };
}
