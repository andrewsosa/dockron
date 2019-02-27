const Docker = require('dockerode');
const { merge, find } = require('lodash');

const logger = require('./logger')(__filename);

class Executor {
    constructor(dockerOpts, containerOpts) {
        this.docker = new Docker(dockerOpts);
        this.containerDefaults = merge(
            {
                Tty: true,
                HostConfig: {
                    AutoRemove: true,
                },
            },
            containerOpts,
        );

        // Test the connection
        this.docker.info(err => {
            if (err)
                logger.error('Failed to connect to Docker daemon: %s', err);
            else logger.debug('Connected to Docker daemon.');
        });

        // Attach an event listener
        this.docker.getEvents({}, (err, data) => {
            if (err) logger.error(err);
            else {
                this.eventStream = data;
                this.eventStream.on('data', chunk => {
                    try {
                        const event = JSON.parse(chunk.toString('utf8'));
                        if (event.status === 'die')
                            logger.debug(
                                'Container exited - %s',
                                event.Actor.ID.slice(0, 12),
                            );
                    } catch (err2) {
                        logger.error(err2);
                    }
                });
            }
        });
    }

    async execute({ image, command, network }) {
        try {
            if (!image) throw new Error('No image defined');

            // Pull Docker image
            logger.debug('Pulling image - %s', image);
            await this.docker.pull(image);

            // Create the container
            let container = await this.docker.createContainer(
                merge(this.containerDefaults, {
                    image,
                    Cmd: command.split(' '),
                }),
            );

            // If we have a network string, do network things:
            if (network) {
                // Find the network
                const networks = await this.docker.listNetworks({
                    Name: network,
                });
                const networkObj = find(networks, { Name: network });
                if (!networkObj)
                    throw new Error(`Could not find network "${network}"`);
                const dockerNet = await this.docker.getNetwork(networkObj.Id);

                // Connect container to network
                await dockerNet.connect({
                    Container: container.id,
                });
                logger.debug(
                    'Connected container to network - %s - %s',
                    container.id.slice(0, 12),
                    network,
                );
            }

            // Launch the container
            container = await container.start();
            logger.log(
                'debug',
                'Container launching - %s - %s',
                container.id.slice(0, 12),
                command,
            );
        } catch (err) {
            logger.error(err);
        }
        return true;
    }
}

module.exports = Executor;
