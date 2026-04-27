const { rmSync } = require('node:fs');
const path = require('node:path');

rmSync(path.join(__dirname, '..', 'dist'), { force: true, recursive: true });
