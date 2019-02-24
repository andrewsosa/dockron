/* eslint-env jest */

const path = require('path');
const loadConfig = require('./config');

const validPath = path.join(__dirname, '../example/sample.toml');
const malformedPath = path.join(__dirname, '../example/invalid.toml');

describe('the config parser', () => {
    test('loads a valid config', () =>
        loadConfig(validPath, conf => {
            expect(conf).toBeTruthy();
        }));

    test('throws on missing file', () => {
        expect(() => loadConfig('some/bad/path')).toThrow(
            /no such file or directory/,
        );
    });

    test('rejects malforned config', () => {
        expect(() => loadConfig(malformedPath)).toThrow(/Expected/);
    });
});
