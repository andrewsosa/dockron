const Docker = require('dockerode');
const { merge } = require('lodash');

const logger = require('./logger')(__filename);

module.exports = (dockerOpts, containerOpts) => {
    const docker = new Docker(dockerOpts);
    const containerDefaults = {
        Tty: true,
        HostConfig: {
            AutoRemove: true,
        },
    };

    return async (image, command) => {
        try {
            if (!image) throw new Error('No image defined');
            let container = await docker.createContainer(
                merge(containerDefaults, {
                    image,
                    Cmd: command.split(' '),
                    ...containerOpts,
                }),
            );
            container = await container.start();
            const data = await container.inspect();
            logger.log(
                'debug',
                'Container launching - %s - %s',
                data.Id.slice(0, 12),
                command,
            );
        } catch (err) {
            logger.log('error', err);
        }
        return true;
    };
};
