"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDB = exports.MessageInMemoryStore = void 0;
const message_1 = require("../models/message");
const inMemoryStore_1 = require("./inMemoryStore");
class MessageInMemoryStore extends inMemoryStore_1.InMemoryStore {
    getById(id) {
        return this.store.find((message) => message.id === id);
    }
    assertHasNotId(id, callback) {
        if (this.getById(id)) {
            console.error(`Message already in DB: ${id}`);
            callback === null || callback === void 0 ? void 0 : callback(`Message already in DB: ${id}`);
            return false;
        }
        return true;
    }
    newRecord(type, room, sender, sendCopyToSelf, content, recipient) {
        const msg = new message_1.Message(type, room, sender, sendCopyToSelf, content, recipient);
        super.add(msg);
        console.log('Added new message to database:', msg.toJson());
        return msg;
    }
}
exports.MessageInMemoryStore = MessageInMemoryStore;
exports.MessageDB = new MessageInMemoryStore();
//# sourceMappingURL=messages.js.map