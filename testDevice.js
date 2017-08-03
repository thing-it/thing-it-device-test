var singleton = {
    prefix: '',
    devices: [],
    actors: [],
    sensors: [],
    metadata: {
        family: "testDevice",
        plugin: "testDevice",
        label: "Test Device",
        connectionTypes: [],
        dataTypes: {},
        actorTypes: [],
        sensorTypes: [],
        services: [],
        configuration: [{
            label: "Board Type",
            id: "boardType",
            type: {
                family: "reference",
                id: "boardType"
            },
            defaultValue: "RASPBERRY"
        }]
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
        });
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

var q = require('q');
var _ = require('lodash');

function TestDevice() {
    TestDevice.prototype.initialize = function (module) {

        return this;
    };

    TestDevice.prototype.start = function () {
        var deferred = q.defer();

        singleton.devices.push(this);

        deferred.resolve();

        return deferred.promise;
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
    };
}
