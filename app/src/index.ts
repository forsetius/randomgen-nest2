import * as crypto from 'crypto';

const a = crypto.randomBytes(6).toString('base64');

console.log(a);
