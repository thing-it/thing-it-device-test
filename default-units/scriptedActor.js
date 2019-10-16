// @ts-check
const cron = require('cron');
const q = require('q');
const requireFromString = require('require-from-string');

/**
 * @constructor
 */
function ScriptedActor() {

    // declare mixed-in helper methods/properties

    /** @type {object} */
    this.device = this.device;
    /** @type {(msg: string, ...args) => void} */
    this.logDebug = this.logDebug;
    /** @type {(msg: string, ...args) => void} */
    this.logInfo = this.logInfo;
    /** @type {(msg: string, ...args) => void} */
    this.logError = this.logError;
    /** @type {() => void} */
    this.publishOperationalStateChange = this.publishOperationalStateChange;
    /** @type {() => void} */
    this.publishStateChange = this.publishStateChange;
    /** @type {(name: string) => void} */
    this.publishEvent = this.publishEvent;

    this.state = {
        executing: false,
    };

    this.configuration = {
        scriptSchedule: '* * * * * *',
        script: '',
    };

    /** @type {import("cron").CronJob} */
    this.scriptJob = undefined;

    /** @type {JobContext} */
    this.jobContext = undefined;

    return this;
}

/**
 *
 */
ScriptedActor.prototype.start = function() {
    this.logInfo('About to start actor ...');
    const deferred = q.defer();

    // Register with Device

    this.device.registerActor(this);

    this.state = {
        executing: false,
    };

    this.operationalState.status = 'OK';
    this.operationalState.message = '';

    this.startExecution();

    deferred.resolve();
    this.logInfo('Started actor');
    return deferred.promise;
};

/**
 *
 */
ScriptedActor.prototype.stop = function() {
    this.logInfo('About to stop actor ...');
    const deferred = q.defer();

    this.stopExecution();

    deferred.resolve();
    this.logInfo('Stopped actor');
    return deferred.promise;
};

/**
 *
 */
ScriptedActor.prototype.getState = function() {
    return this.state;
};

/**
 *
 */
ScriptedActor.prototype.setState = function(state) {
    if (state) {
        if ('executing' in state) {
            this.state.executing = true === state.executing;
        }
    }
};

/**
 *
 */
ScriptedActor.prototype.startExecution = function() {
    if (this.state.executing) {
        this.logInfo('Script execution was already started');
        return;
    }
    if (this.configuration && this.configuration.script && this.configuration.scriptSchedule) {
        try {
            this.logInfo('About to start script execution ...');
            const script = this.loadScript(this.configuration.script);
            this.jobContext = {
                host: this,
                logDebug: this.logDebug,
                logInfo: this.logInfo,
                logError: this.logError,
            };
            this.scriptJob = cron.job(this.configuration.scriptSchedule, () => {
                try {
                    script.apply(this.jobContext);
                } catch (err) {
                    this.logError('Failed executing script', err);
                }
            });
            this.scriptJob.start();
            this.state.executing = this.scriptJob.running;

            this.logInfo('Started script execution');

            this.operationalState = {status: 'OK', message: ''};
            this.publishOperationalStateChange();
        } catch (err) {
            this.logError('Failed starting script execution', err);

            this.operationalState = {status: 'ERROR', message: 'Failed starting script execution'};
            this.publishOperationalStateChange();
        }
    } else {
        this.logInfo('Skipping start of script execution, no script or schedule configured');
    }

    this.publishStateChange();
};

/**
 *
 */
ScriptedActor.prototype.stopExecution = function() {
    if (this.scriptJob) {
        try {
            this.logInfo('About to stop script execution ...');
            this.scriptJob.stop();
            this.scriptJob = undefined;
            this.jobContext = undefined;

            this.state.executing = false;
            this.logInfo('Stopped script execution');

            this.operationalState = {status: 'OK', message: ''};
            this.publishOperationalStateChange();
        } catch (err) {
            this.logError('Failed stopping script execution', err);

            this.operationalState = {status: 'ERROR', message: 'Failed stopping script execution'};
            this.publishOperationalStateChange();
        }
    }

    this.publishStateChange();
};

/**
 *
 */
ScriptedActor.prototype.toggleExecution = function() {
    if (this.state.executing) {
        this.stopExecution();
    } else {
        this.startExecution();
    }
    // new state will be published implicitly
};

/**
 *
 */
ScriptedActor.prototype.generateEvent = function() {
    this.publishEvent("manualGeneratedEvent");
}

/**
 * @param {string} scriptText
 * @returns {() => void}
 */
ScriptedActor.prototype.loadScript = function(scriptText) {
    try {
        let parsedScript = requireFromString(scriptText);
        if ('function' !== typeof parsedScript) {
            parsedScript = requireFromString('module.exports = ' + scriptText);
        }

        if (parsedScript instanceof Function) {
            // enrich script context
            return parsedScript;
        }
        throw new Error('Failed loading script, script must resolve to a function');
    } catch (err) {
        this.logError(`Failed parsing script`, err);
        throw new Error(`Failed parsing script`);
    }
}

module.exports = {
    metadata: {
        plugin: "testActorScripted",
        label: "Test Actor (Scripted)",
        role: "actor",
        family: "scriptedActor",
        deviceTypes: ["test/testDevice"],
        tangible: false,
        events: [{
            id: "manualGeneratedEvent",
            label: "Manual generated Event"
        }],
        services: [{
            id: "startExecution",
            label: "Start"
        }, {
            id: "stopExecution",
            label: "Stop"
        }, {
            id: "toggleExecution",
            label: "Toggle"
        }, {
            id: "generateEvent",
            label: "Generate Event"
        }],
        state: [{
            id: "executing",
            label: "Executing",
            type: {
                id: 'boolean'
            }
        }],
        configuration: [{
            id: 'scriptSchedule',
            label: 'Logic Schedule (cron expression)',
            type: {
                id: 'string'
            }
        }, {
            id: 'script',
            label: 'Actor Logic',
            type: {
                id: 'javascript'
            }
        }]
    },
    create: function () {
        return new ScriptedActor();
    }
};

/**
 * @typedef {{host: ScriptedActor, logDebug: (msg: string, ...args) => void, logInfo: (msg: string, ...args) => void, logError: (msg: string, ...args) => void, [key: string]: any}} JobContext
 */
