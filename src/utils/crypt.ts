import bcrypt from 'bcrypt';
import crypto from 'crypto';

function authorize(hash: string, secret: string): boolean {
    return bcrypt.compareSync(secret, hash);
}

export function generateRandomPassword(
    length: number = 16,
    saltRounds: number = 15
): string {
    const plaintextPassword = crypto
        .randomBytes(length)
        .toString('base64')
        .slice(0, length);
    console.error(plaintextPassword);
    return bcrypt.hashSync(plaintextPassword, saltRounds);
}

export function validate(
    venue: string,
    name: string,
    hash: string,
    secret: string,
    callback?: (error?: string) => void
): boolean {
    if (!venue) {
        console.error('No venue provided');
        callback?.('No venue provided');
        return false;
    }
    if (!name) {
        console.error('No room name provided');
        callback?.('No room name provided');
        return false;
    }
    if (!hash) {
        console.error('No hash provided');
        callback?.('No hash provided');
        return false;
    }
    if (!authorize(hash, secret)) {
        console.error('Authorization failed');
        callback?.('Authorization failed');
        return false;
    }
    return true;
}
