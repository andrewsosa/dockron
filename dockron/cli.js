const path = require('path');
const config = require('./config');
const scheduler = require('./scheduler');

config(path.join(process.cwd(), 'tests/configs/sample.toml'), conf => {
    Object.keys(conf).map(name => scheduler.schedule(name, conf[name]));
});
