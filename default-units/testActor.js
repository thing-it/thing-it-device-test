module.exports = {
    metadata: {
        plugin: "testActor",
        label: "Test Actor",
        role: "actor",
        family: "testActor",
        deviceTypes: ["test/testDevice"],
        tangible: false,
        events: [{
            id: "manualGeneratedEvent",
            label: "Manual generated Event"
        }],
        services: [{
            id: "on",
            label: "On"
        }, {
            id: "off",
            label: "Off"
        }, {
            id: "toggle",
            label: "Toggle"
        }, {
            id: "blink",
            label: "Blink"
        }, {
            id: "generateEvent",
            label: "Generate Event"
        }],
        state: [{
            id: "light",
            label: "Light",
            type: {
                id: "string"
            }
        }],
        configuration: [{
            id: 'operationalStateInterval',
            label: 'Operational State Interval (ms)',
            type: {
                id: 'integer'
            }
        }]
    },
    create: function () {
        return new TestActor();
    }
};

var q = require('q');

/**
 *
 */
function TestActor() {
    /**
     *
     */
    TestActor.prototype.start = function () {
        var deferred = q.defer();

        // Register with Device

        this.device.registerActor(this);

        this.state = {
            light: "off"
        };

        this.operationalState.status = 'OK';

        setInterval(function() {
            if (this.operationalState.status === 'OK') {
                this.operationalState = {status: "ERROR", message: "Network connection lost"};
            } else if (this.operationalState.status === 'ERROR') {
                this.operationalState = {status: "PENDING", message: "Reconnecting"};
            } else if (this.operationalState.status === 'PENDING') {
                this.operationalState = {status: "OK", message: "Normal"};
            }

            this.publishOperationalStateChange();
        }.bind(this), this.configuration && this.configuration.operationalStateInterval ? this.configuration.operationalStateInterval : 30 * 1000);

        deferred.resolve();

        return deferred.promise;
    };

    /**
     *
     */
    TestActor.prototype.getState = function () {
        return this.state;
    };

    /**
     *
     */
    TestActor.prototype.setState = function (state) {
        this.state = state;
    };

    /**
     *
     */
    TestActor.prototype.on = function () {
        this.state.light = "on";

        this.publishStateChange();
    };

    /**
     *
     */
    TestActor.prototype.off = function () {
        this.state.light = "off";

        this.publishStateChange();
    };

    /**
     *
     */
    TestActor.prototype.toggle = function () {
        if (this.state.light == "off") {
            this.state.light = "on";
        } else {
            this.state.light = "off";
        }

        this.publishStateChange();
    };

    /**
     *
     */
    TestActor.prototype.blink = function () {
        this.state.light = "blink";

        this.publishStateChange();
    };
    /**
     *
     */
    TestActor.prototype.generateEvent = function () {
        this.publishEvent("manualGeneratedEvent");
    }
}