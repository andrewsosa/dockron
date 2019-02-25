const path = require('path');
const loadConfig = require('./config');
const executor = require('./executor');
const Scheduler = require('./scheduler');

// Remove -- from opts
function cleanArgs(opts) {
    return Object.entries(opts)
        .map(([opt, val]) => ({
            opt: opt.slice(2),
            val,
        }))
        .reduce((obj, { opt, val }) => Object.assign(obj, { [opt]: val }), {});
}

// Do the things
function cli(args) {
    const { config, socket, validate } = cleanArgs(args);

    // const confPath = path.join(process.cwd(), config);
    const execute = executor({ socketPath: socket });
    const scheduler = Scheduler(execute);

    const callback = validate
        ? () => {}
        : conf => conf.map(spec => scheduler.schedule(spec.name, spec));

    loadConfig(config, callback);
}

module.exports = { cleanArgs, cli };
