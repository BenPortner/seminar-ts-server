"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const moment_1 = __importDefault(require("moment"));
const user_1 = require("./user");
class Message {
    constructor(type, room, sender, sendCopyToSelf, content, recipient) {
        this.type = type;
        this.time = (0, moment_1.default)().format('hh:mm:ss');
        this.room = room;
        this.sender = sender;
        this.recipient = recipient;
        this.sendCopyToSelf = sendCopyToSelf;
        this.content = content;
    }
    get id() {
        var _a;
        return `${this.type}|${this.time}|${this.room.id}|${this.sender.id}|${(_a = this.recipient) === null || _a === void 0 ? void 0 : _a.id}`;
    }
    toJson() {
        var _a;
        return {
            id: this.id,
            time: this.time,
            room: this.room.toJson(),
            sender: this.sender.toJson(),
            recipient: (_a = this.recipient) === null || _a === void 0 ? void 0 : _a.toJson(),
            copy: this.sendCopyToSelf,
            content: this.content,
        };
    }
    sendTo(toSocket, callback) {
        const { sender, recipient, room } = this;
        if (!sender.isInRoom(room)) {
            callback === null || callback === void 0 ? void 0 : callback(`Sender ${sender.id} is not in room "${room.id}"`);
            console.error(`Sender ${sender.id} is not in room "${room.id}"`);
            return false;
        }
        if (recipient instanceof user_1.User && !recipient.isInRoom(room)) {
            callback === null || callback === void 0 ? void 0 : callback(`Recipient ${recipient.id} is not in room "${room.id}"`);
            console.error(`Recipient ${recipient.id} is not in room "${room.id}"`);
            return false;
        }
        if (this.type == 'announcement' && !sender.isHost(room)) {
            callback === null || callback === void 0 ? void 0 : callback('Only hosts can make announcements');
            console.error('Only hosts can make announcements');
            return false;
        }
        toSocket.emit(this.type, this.toJson());
        console.log(`User ${sender.id} sent ${this.type} to "${recipient === null || recipient === void 0 ? void 0 : recipient.id}"`, this.content);
        if (this.sendCopyToSelf) {
            sender.socket.emit(this.type, this.toJson());
            console.log(`User ${this.id} sent copy of to self`);
        }
        return true;
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map