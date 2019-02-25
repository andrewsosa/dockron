const fs = require('fs');
const joi = require('joi');
const toml = require('toml');
const logger = require('./logger')(__filename);

const tagRegex = /(([a-zA-Z0-9]+)(:[0-9]+)?\/)?([a-zA-Z0-9]+\/)?([a-zA-Z0-9]+)(:[a-zA-Z0-9]+)?/;

const specSchema = joi.object().keys({
    name: joi.string().required(),
    schedule: joi.string().required(),
    image: joi
        .string()
        .regex(tagRegex)
        .required(),
    command: joi.string().required(),
    network: joi.string().required(),
});

const specArray = joi.array().items(specSchema);

const flatten = conf =>
    Object.keys(conf).map(name => Object.assign(conf[name], { name }));

module.exports = (path, fn) => {
    try {
        const data = fs.readFileSync(path);
        const parsed = toml.parse(data);
        const flat = flatten(parsed);
        joi.validate(flat, specArray);
        logger.debug('Loaded config at %s', path);
        fn(flat);
    } catch (err) {
        logger.error(err);
        throw err;
    }
};
