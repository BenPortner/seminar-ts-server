"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomPassword = generateRandomPassword;
exports.validate = validate;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
function authorize(hash, secret) {
    return bcrypt_1.default.compareSync(secret, hash);
}
function generateRandomPassword(length = 16, saltRounds = 15) {
    const plaintextPassword = crypto_1.default
        .randomBytes(length)
        .toString('base64')
        .slice(0, length);
    console.error(plaintextPassword);
    return bcrypt_1.default.hashSync(plaintextPassword, saltRounds);
}
function validate(venue, name, hash, secret, callback) {
    if (!venue) {
        console.error('No venue provided');
        callback === null || callback === void 0 ? void 0 : callback('No venue provided');
        return false;
    }
    if (!name) {
        console.error('No room name provided');
        callback === null || callback === void 0 ? void 0 : callback('No room name provided');
        return false;
    }
    if (!hash) {
        console.error('No hash provided');
        callback === null || callback === void 0 ? void 0 : callback('No hash provided');
        return false;
    }
    if (!authorize(hash, secret)) {
        console.error('Authorization failed');
        callback === null || callback === void 0 ? void 0 : callback('Authorization failed');
        return false;
    }
    return true;
}
//# sourceMappingURL=crypt.js.map