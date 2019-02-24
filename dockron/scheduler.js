const schedule = require('node-schedule');
const logger = require('./logger')(__filename);

module.exports = execute => ({
    schedule: (name, spec) => {
        logger.log(
            'info',
            'New job registered "%s" - "%s" - "%s" - "%s"',
            name,
            spec.image,
            spec.command,
            spec.schedule,
        );
        schedule.scheduleJob(spec.schedule, async () => {
            logger.log('info', '%s - Job started - %s', name, spec.command);
            await execute(spec.image, spec.command);
            // logger.log('info', '%s - Job finished', name);
        });
    },
});
