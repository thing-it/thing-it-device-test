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
        interfaces: ['AccessManager', 'Occupiable', 'ActorEventListener'],
        accessManagerPathsLookup: ['rolePath1', 'rolePath2'],
        connectionTypes: [],
        dataTypes: {},
        actorTypes: [],
        sensorTypes: [],
        services: [{
            id: "occupy",
            label: "Occupy"
        },  {
            id: "release",
            label: "Release"
        }],
        configuration: [
            {
                label: 'User Role Path 1',
                id: 'rolePath1',
                type: {
                    id: 'string'
                },
                defaultValue: ''
            }, {
                label: 'User Role Path 2',
                id: 'rolePath2',
                type: {
                    id: 'string'
                },
                defaultValue: ''
            }, {
                id: "secureToken",
                label: "Secure Token",
                type: {
                    id: "string",
                    encrypted: true
                }
            }
        ]
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
const _ = require('lodash');
const Queue = require('promise-queue');

const queue = new Queue(1, Infinity);

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

    TestDevice.prototype.occupy = function (params) {

        var user = params.__header && params.__header.userDetails ? params.__header.userDetails : params.loggedInUser;

        delete user.entitlements;

        this.logInfo(`occupy ${JSON.stringify(user)}`);

        this.state.lastUser =  this.state.user;
        this.state.user = user;

        this.publishStateChange();
    };

    TestDevice.prototype.release = function (params) {

        var user = params.__header && params.__header.userDetails ? params.__header.userDetails : params.loggedInUser;

        delete user.entitlements;

        this.logInfo(`release ${JSON.stringify(user)}`);

        this.state.lastUser =  user;
        this.state.user = null;

        this.publishStateChange();
    };

    TestDevice.prototype.stop = function () {
        return q.resolve();
    };

    TestDevice.prototype.updateEntitlements = function (params) {

        return new Promise((resolve, reject) => {

                queue.add(async () => {

                try {

                    await this.updateEntitlementsSync(params);
        this.logInfo(`Update Entitlements Done`);
        resolve();

    } catch (error) {

            this.logError(`Update Entitlements Failed: ${error}`);
            reject();

        }

    })
        .catch((error) => {
            this.logError(error);
    });

    });

    }

    TestDevice.prototype.updateEntitlementsSync = async function (params) {

        const user = params.user;

        const change = params.changes.length ? params.changes[0] : null;

        this.logInfo(`Update entitlement invoked for ${JSON.stringify(user)} with changes ${JSON.stringify(change)}.`);

        return;
    };

    TestDevice.prototype.reconcileEntitlements = function (params) {

        return new Promise((resolve, reject) => {

                queue.add(async () => {

                try {

                    await this.reconcileEntitlementsSync(params);
        this.logInfo(`Reconcile Entitlements Done`);
        resolve();

    } catch (error) {

            this.logError(`Reconcile Entitlements Failed: ${error}`);
            reject();

        }

    })
        .catch((error) => {
            this.logError(error);
    });

    });

    };

    TestDevice.prototype.reconcileEntitlementsSync = async function (params) {

        const user = params.user;

        const changes = params.changes;

        this.logInfo(`Reconcile entitlements invoked for ${JSON.stringify(user)} with changes ${JSON.stringify(changes)}.`);

        return;

    };
}
