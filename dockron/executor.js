const Docker = require('dockerode');
const { merge, find } = require('lodash');

const logger = require('./logger')(__filename);

module.exports = (dockerOpts, containerOpts) => {
    const docker = new Docker(dockerOpts);
    const containerDefaults = {
        Tty: true,
        HostConfig: {
            AutoRemove: true,
        },
    };

    // Test the connection
    docker.info(err => {
        if (err) logger.crit('Failed to connect to Docker daemon: %s', err);
        else logger.debug('Connected to Docker daemon.');
    });

    return async ({ image, command, network }) => {
        try {
            if (!image) throw new Error('No image defined');

            // Pull Docker image
            logger.debug('Pulling image - %s', image);
            await docker.pull(image);

            // Create the container
            let container = await docker.createContainer(
                merge(containerDefaults, {
                    image,
                    Cmd: command.split(' '),
                    ...containerOpts,
                }),
            );

            // If we have a network string, do network things:
            if (network) {
                // Find the network
                const networks = await docker.listNetworks({ Name: network });
                const networkId = find(networks, { Name: network }).Id;
                const dockerNet = await docker.getNetwork(networkId);

                // Connect container to network
                dockerNet.connect(
                    {
                        Container: container.id,
                    },
                    err => {
                        if (err)
                            logger.error(
                                'Connection to endpoint failed - %s',
                                err,
                            );
                        else
                            logger.debug(
                                'Connected container to network - %s - %s',
                                container.id.slice(0, 12),
                                networkId.slice(0, 12),
                            );
                    },
                );
            }

            container = await container.start();
            logger.log(
                'debug',
                'Container launching - %s - %s',
                container.id.slice(0, 12),
                command,
            );
        } catch (err) {
            logger.log('error', err);
        }
        return true;
    };
};
