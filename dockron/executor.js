const Docker = require('dockerode');

const logger = require('./logger')(__filename);

module.exports = opts => {
    const docker = new Docker(opts);

    return (image, command) =>
        docker
            .createContainer({
                image,
                Cmd: command.split(' '),
                Tty: true,
                HostConfig: {
                    AutoRemove: true,
                },
            })
            .then(container => container.start())
            .then(container =>
                container.inspect((err, data) => {
                    if (err) {
                        logger.log('error', err);
                    } else {
                        logger.log(
                            'debug',
                            'Container launching - %s - %s',
                            data.Id.slice(0, 12),
                            command,
                        );
                    }
                }),
            )
            .catch(err => logger.log('error', err));
};
