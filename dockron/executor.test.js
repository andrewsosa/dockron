/* eslint-env jest */

const fs = require('fs');
const executor = require('./executor');

const testFilePath = '/tmp/testfile';

const containerOpts = {
    HostConfig: {
        AutoRemove: true,
        Binds: [`${testFilePath}:${testFilePath}`],
    },
};

describe('the docker executor', () => {
    test('can run a containerized command', async () => {
        const execute = executor({}, containerOpts);
        const testString = 'Hello, world';
        await execute('alpine', `echo "${testString}" > ${testFilePath}`);
        expect(fs.readFileSync(testFilePath, 'utf8')).toMatch(testString);
    });

    test('gracefully fails with bad parameters', async () => {
        const execute = executor();
        await expect(execute("''", 'not a command')).resolves.toBe(true);
    });
});
