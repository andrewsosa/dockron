#!/usr/bin/env node
const path = require('path');
const pkgPath = path.join(__dirname, '../package.json');
const { version } = require(pkgPath);
console.log(version);
