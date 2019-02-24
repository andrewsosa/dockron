const path = require('path');
const config = require('./config');
const scheduler = require('./scheduler');

config(path.join(process.cwd(), 'example/sample.toml'), conf =>
    conf.map(spec => scheduler.schedule(spec.name, spec)),
);
