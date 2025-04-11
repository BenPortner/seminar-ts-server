import dotenv from 'dotenv';
import { generateRandomPassword } from './crypt';

// Load the appropriate .env file based on NODE_ENV
dotenv.config({
    path:
        process.env.NODE_ENV === 'production'
            ? 'env/.env.prod'
            : 'env/.env.dev',
});
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 4433;
const origin = (process.env.ORIGIN || `http://${host}:${port}`).split(',');
const adminUIAuth =
    process.env.SOCKETIO_ADMINUI_AUTH === 'false' ? false : true;
const adminUIUsername =
    process.env.SOCKETIO_ADMINUI_AUTH_USERNAME || 'admin';
let adminUIPassword = process.env.SOCKETIO_ADMINUI_AUTH_PASSWORD;
if (adminUIAuth && !adminUIPassword) {
    console.error(
        'Environment variable SOCKETIO_ADMINUI_AUTH_PASSWORD was not set. Creating a Admin UI password for you:'
    );
    adminUIPassword = generateRandomPassword();
}

const adminUIAuthOptions = adminUIAuth === false ? false : {
    type: 'basic' as const,
    username: adminUIUsername,
    password: adminUIPassword!,
} 
// also merge in commandline args
const args = process.argv.slice(2);
const privateKeyPath = args[0] || process.env.HTTPS_PRIVATE_KEY;
const certificatePath = args[1] || process.env.HTTPS_CERTIFICATE;

export {
    port,
    origin,
    privateKeyPath,
    certificatePath,
    adminUIAuthOptions
}