/* eslint-env jest */

const { cleanArgs } = require('./cli');

describe('command line interface', () => {
    test('cleans the argument object', () => {
        const defaultArgs = {
            '--config': '/etc/dockron/dockron.toml',
            '--help': false,
            '--socket': '/var/run/docker.sock',
            '--validate': false,
        };

        const cleanKeys = Object.keys(defaultArgs).map(key => key.slice(2));
        const cleanedArgs = cleanArgs(defaultArgs);

        expect(Object.keys(cleanedArgs)).toMatchObject(cleanKeys);
    });
});
