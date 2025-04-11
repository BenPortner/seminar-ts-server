"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUIAuthOptions = exports.certificatePath = exports.privateKeyPath = exports.origin = exports.port = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const crypt_1 = require("./crypt");
// Load the appropriate .env file based on NODE_ENV
dotenv_1.default.config({
    path: process.env.NODE_ENV === 'production'
        ? 'env/.env.prod'
        : 'env/.env.dev',
});
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 4433;
exports.port = port;
const origin = (process.env.ORIGIN || `http://${host}:${port}`).split(',');
exports.origin = origin;
const adminUIAuth = process.env.SOCKETIO_ADMINUI_AUTH === 'false' ? false : true;
const adminUIUsername = process.env.SOCKETIO_ADMINUI_AUTH_USERNAME || 'admin';
let adminUIPassword = process.env.SOCKETIO_ADMINUI_AUTH_PASSWORD;
if (adminUIAuth && !adminUIPassword) {
    console.error('Environment variable SOCKETIO_ADMINUI_AUTH_PASSWORD was not set. Creating a Admin UI password for you:');
    adminUIPassword = (0, crypt_1.generateRandomPassword)();
}
const adminUIAuthOptions = adminUIAuth === false ? false : {
    type: 'basic',
    username: adminUIUsername,
    password: adminUIPassword,
};
exports.adminUIAuthOptions = adminUIAuthOptions;
// also merge in commandline args
const args = process.argv.slice(2);
const privateKeyPath = args[0] || process.env.HTTPS_PRIVATE_KEY;
exports.privateKeyPath = privateKeyPath;
const certificatePath = args[1] || process.env.HTTPS_CERTIFICATE;
exports.certificatePath = certificatePath;
//# sourceMappingURL=config.js.map