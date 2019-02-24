const schedule = require('node-schedule');
const executor = require('./executor');
const logger = require('./logger')(__filename);

const execute = executor();

module.exports = {
    schedule: (name, spec) => {
        logger.log(
            'info',
            'New job registered "%s" - "%s" - "%s" - "%s"',
            name,
            spec.image,
            spec.command,
            spec.schedule,
        );
        schedule.scheduleJob(spec.schedule, () => {
            logger.log('info', '%s - Job started - %s', name, spec.command);
            execute(spec.image, spec.command);
        });
    },
};
