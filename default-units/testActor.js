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
        this.state.light = state.light;

        if (this.TestActor) {
            if (this.state.light === "blink") {
                this.TestActor.blink();
            } else if (this.state.light === "on") {
                this.TestActor.on();
            } else {
                this.TestActor.stop().off();
            }
        }
    };

    /**
     *
     */
    TestActor.prototype.on = function () {
        if (this.TestActor) {
            this.TestActor.on();
        }

        this.state.light = "on";

        this.publishStateChange();
    };

    /**
     *
     */
    TestActor.prototype.off = function () {
        if (this.TestActor) {
            this.TestActor.stop().off();
        }

        this.state.light = "off";

        this.publishStateChange();
    };

    /**
     *
     */
    TestActor.prototype.toggle = function () {
        if (this.state.light == "off") {
            this.state.light = "on";

            if (this.TestActor) {
                this.TestActor.on();
            }
        } else {
            this.state.light = "off";

            if (this.TestActor) {
                this.TestActor.stop().off();
            }
        }

        this.publishStateChange();
    }

    /**
     *
     */
    TestActor.prototype.blink = function () {
        if (this.TestActor) {
            this.TestActor.blink();
        }

        this.state.light = "blink";

        this.publishStateChange();
    }
};