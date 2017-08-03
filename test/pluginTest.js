var assert = require("assert");
var testDeviceModule = require("../testDevice");

describe('[thing-it] Device Test', function () {
    var testDriver;

    before(function () {
        testDriver = require("thing-it-test").createTestDriver({logLevel: "debug"});

        testDriver.registerDevicePlugin('test', __dirname + "/../testDevice");
    });
    describe('Basic Test', function () {
        this.timeout(10000);

        it('should complete without error', function (done) {
            setTimeout(function () {
                console.log('Devices', testDeviceModule.devices[0].label);

                done();
            }.bind(this), 5000);

            testDriver.start({
                configuration: require("../examples/configuration.js"),
                heartbeat: 10,
                simulated: false
            });
        });

        it('should produce Device values', function (done) {
            testDriver.addListener({
                publishDeviceStateChange: function (event) {
                    console.log(event);
                    done();
                }
            });
            testDeviceModule.devices[0].setState({integerField: 10, stringField: 'Test'});
        });
    });
});





