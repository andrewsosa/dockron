const fs = require('fs');
const toml = require('toml');

module.exports = (path, fn) => {
    const confpath = path || '/etc/dockron/dockron.toml';
    fs.readFile(confpath, (err, data) => {
        if (err) throw err;
        const parsed = toml.parse(data);
        fn(parsed);
    });
};
