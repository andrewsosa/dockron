const path = require('path');
const loadConfig = require('./config');
const Executor = require('./executor');
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

    const confPath = path.isAbsolute(config)
        ? config
        : path.join(process.cwd(), config);
    const { execute } = new Executor({ socketPath: socket });
    const scheduler = Scheduler(execute);

    const callback = validate
        ? () => {}
        : conf => conf.map(spec => scheduler.schedule(spec.name, spec));

    loadConfig(confPath, callback);
}

module.exports = { cleanArgs, cli };
