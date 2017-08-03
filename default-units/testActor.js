module.exports = {
    metadata: {
        plugin: "testActor",
        label: "Test Actor",
        role: "actor",
        family: "testActor",
        deviceTypes: ["test/testDevice"],
        services: [{
            id: "on",
            label: "On"
        }, {
            id: "off",
            label: "Off"
        }, {
            id: "blink",
            label: "Blink"
        }],
        state: [{
            id: "light",
            label: "Light",
            type: {
                id: "string"
            }
        }],
        configuration: [{
            label: "Pin",
            id: "pin",
            type: {
                family: "reference",
                id: "digitalInOutPin"
            },
            defaultValue: "12"
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
    }

    /**
     *
     */
    TestActor.prototype.blink = function () {
        this.state.light = "blink";

        this.publishStateChange();
    }
};