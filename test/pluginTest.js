var assert = require("assert");
var testDeviceModule = require("../testDevice");

describe('[thing-it] Device Test', function () {
    var testDriver;

    before(function () {
        testDriver = require("thing-it-test").createTestDriver({logLevel: "debug"});

        testDriver.registerDevicePlugin('test', __dirname + "/../testDevice");
        testDriver.registerUnitPlugin(__dirname + "/../default-units/testActor");
        testDriver.registerUnitPlugin(__dirname + "/../default-units/testSensor");
    });
    describe('Basic Test', function () {
        this.timeout(10000);

        it('should complete without error', function (done) {
            setTimeout(function () {
                console.log('Device', testDeviceModule.getDevice('testDevice1').label);
                console.log('Actor', testDeviceModule.getActor('testDevice1', 'testActor1').label);
                console.log('Sensor', testDeviceModule.getSensor('testDevice1', 'testSensor1').label);

                done();
            }.bind(this), 5000);

            testDriver.start({
                configuration: require("../examples/configuration.js"),
                heartbeat: 10,
                simulated: false
            });
        });
        it('should trigger Device State Change Notification', function (done) {
            testDriver.addListener({
                publishDeviceStateChange: function (event) {
                    console.log(event);
                    done();
                }
            });
            testDeviceModule.getDevice('testDevice1').setState({integerField: 10, stringField: 'Test'});
        });
        it('should trigger Actor State Change Notification', function (done) {
            testDriver.addListener({
                publishActorStateChange: function (event) {
                    console.log(event);
                    done();
                }
            });
            testDeviceModule.getActor('testDevice1', 'testActor1').on();
        });
        it('should trigger Sensor Event Publishing', function (done) {
            testDriver.addListener({
                publishEvent: function (event) {
                    console.log(event);
                    done();
                }
            });
            testDeviceModule.getSensor('testDevice1', 'testSensor1').publishEvent('click', {});
        });
    });
});





