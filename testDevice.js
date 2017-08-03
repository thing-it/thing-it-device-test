var singleton = {
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
    getDevice: function (id) {
        return _.find();
    },
    getActor: function (deviceId, id) {
        return _.find();
    },
    getSensor: function (deviceId, id) {
        return _.find();
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
