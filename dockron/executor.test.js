/* eslint-env jest */

const fs = require('fs');
const Executor = require('./executor');

const testFilePath = '/tmp/testfile';

const containerOpts = {
    HostConfig: {
        AutoRemove: true,
        Binds: [`${testFilePath}:${testFilePath}`],
    },
};

describe('the docker executor', () => {
    test('can run a containerized command', async () => {
        const executor = new Executor({}, containerOpts);
        const testString = 'Hello, world';
        await executor.execute(
            'alpine',
            // `echo "${testString}" > ${testFilePath}`,
            'echo "Hello world"',
        );
        expect(fs.readFileSync(testFilePath, 'utf8')).toMatch(testString);
        executor.eventSteam.destroy();
    });

    test('gracefully fails with bad parameters', async () => {
        const executor = new Executor();
        await expect(executor.execute("''", 'not a command')).resolves.toBe(
            true,
        );
        // executor.eventSteam.destroy();
    });
});
