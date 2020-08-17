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
        },  {
            id: "occupy",
            label: "Occupy"
        },  {
            id: "release",
            label: "Release"
        }],
        configuration: [{
            id: 'submitRate',
            label: 'Submit Rate (ms)',
            type: {
                id: 'integer'
            }
        }, {
            id: 'operationalStateInterval',
            label: 'Operational State Interval (ms)',
            type: {
                id: 'integer'
            }
        }, {
            id: 'throttlingMinInterval',
            label: 'Min Interval (ms)',
            type: {
                id: 'integer'
            }
        }, {
            id: 'throttlingMaxAge',
            label: 'Max Age (ms)',
            type: {
                id: 'integer'
            }
        }, {
            id: 'throttlingMaxRejected',
            label: 'Max Rejected',
            type: {
                id: 'integer'
            }
        }]
    },
    create: function () {
        return new TestSensor();
    }
};

const q = require('q');

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

        setInterval(() => {
            this.publishStateChange({temperature: 15 + Math.ceil(Math.random() * 10)});

        }, this.configuration && this.configuration.submitRate ? this.configuration.submitRate : 10000);

        this.operationalState.status = 'OK';

        setInterval(() => {
            if (this.operationalState.status === 'OK') {
                this.operationalState = {status: "ERROR", message: "Network connection lost"};
            } else if (this.operationalState.status === 'ERROR') {
                this.operationalState = {status: "PENDING", message: "Reconnecting"};
            } else if (this.operationalState.status === 'PENDING') {
                this.operationalState = {status: "OK", message: "Normal"};
            }

            this.publishOperationalStateChange();
        }, this.configuration && this.configuration.operationalStateInterval ? this.configuration.operationalStateInterval : 30 * 1000);

        return q.resolve();
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

    TestSensor.prototype.occupy = function (params) {

        var user = params.__header && params.__header.userDetails ? params.__header.userDetails : params.loggedInUser;

        delete user.entitlements;

        this.logInfo(`occupy ${JSON.stringify(user)}`);

        this.state.lastUser =  this.state.user;
        this.state.user = user;

        this.publishStateChange();
    };

    TestSensor.prototype.release = function (params) {

        var user = params.__header && params.__header.userDetails ? params.__header.userDetails : params.loggedInUser;

        delete user.entitlements;

        this.logInfo(`release ${JSON.stringify(user)}`);

        this.state.lastUser =  user;
        this.state.user = null;

        this.publishStateChange();
    };
};
