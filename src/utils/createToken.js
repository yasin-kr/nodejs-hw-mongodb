import crypto from 'node:crypto';

export const createToken = () => crypto.randomBytes(30).toString('base64url');
