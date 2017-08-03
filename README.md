# thing-it-device-test

[![NPM](https://nodei.co/npm/thing-it-device-test.png)](https://nodei.co/npm/thing-it-device-test/)
[![NPM](https://nodei.co/npm-dl/thing-it-device-test.png)](https://nodei.co/npm/thing-it-device-test/)

[thing-it-node] Test Device Plugin for complex tests on thing-it-node

The components

* testDevice
* testActor
* testSensor

can be used as regular [thing-it-node] components, but also accessed centrally to drive behavior in a test suite, e.g.

```javascript
var componentManager = require("../testDevice");

componentManager.getDevice('testDevice1');

componentManager.getActor('testDevice1', 'testActor1').on();

componentManager.getSensor('testDevice1', 'testSensor1').pushEvent({'click'});

```

which allows you to regression test [thing-it-node] configurations.
