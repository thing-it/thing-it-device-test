module.exports = {
    label: "Test",
    id: "test",
    autoDiscoveryDeviceTypes: [],
    devices: [{
        label: "Test Device 1",
        id: "testDevice1",
        plugin: "test/testDevice",
        configuration: {},
        actors: [{
            id: "testActor1",
            label: "Test Actor 1",
            type: "testActor",
            configuration: {}
        }],
        sensors: [{
            id: "testSensor1",
            label: "Test Sensor 1",
            type: "testSensor",
            configuration: {}
        }]
    }],
    groups: [],
    services: [],
    eventProcessors: [],
    data: []
};
