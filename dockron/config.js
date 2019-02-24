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
});

const specArray = joi.array().items(specSchema);

const flatten = conf =>
    Object.keys(conf).map(name => Object.assign(conf[name], { name }));

module.exports = (path, fn) => {
    const confpath = path || '/etc/dockron/dockron.toml';
    fs.readFile(confpath, (err, data) => {
        if (err) {
            logger.error(err);
            return;
        }
        const parsed = toml.parse(data);
        const flat = flatten(parsed);
        joi.validate(flat, specArray, valErr => {
            if (valErr) {
                logger.error(valErr);
                return;
            }
            fn(flat);
        });
    });
};
