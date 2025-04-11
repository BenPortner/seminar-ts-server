"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomDB = void 0;
const room_1 = require("../models/room");
const inMemoryStore_1 = require("./inMemoryStore");
class RoomInMemoryStore extends inMemoryStore_1.InMemoryStore {
    getById(id) {
        return this.store.find((room) => room.id === id);
    }
    assertGetById(id, callback) {
        const room = this.getById(id);
        if (!room) {
            console.error(`Room not found in DB: ${id}`);
            callback === null || callback === void 0 ? void 0 : callback(`Room not found in DB: ${id}`);
        }
        return room;
    }
    get(venue, name, hash) {
        return this.store.find((room) => room.venue === venue && room.name === name && room.hash === hash);
    }
    assertGet(venue, name, hash, callback) {
        const room = this.get(venue, name, hash);
        if (!room) {
            console.error(`Room not found in DB: ${venue} ${name} ${hash}`);
            callback === null || callback === void 0 ? void 0 : callback(`Room not found in DB: ${venue} ${name} ${hash}`);
        }
        return room;
    }
    assertHasNot(venue, name, hash, callback) {
        if (this.get(venue, name, hash)) {
            console.error(`Room already in DB: ${venue} ${name} ${hash}`);
            callback === null || callback === void 0 ? void 0 : callback(`Room already in DB: ${venue} ${name} ${hash}`);
            return false;
        }
        return true;
    }
    delete(id, callback) {
        const room = this.assertGetById(id, callback);
        if (room) {
            this.remove((item) => item.id === id);
            console.log(`Deleted room from database: ${room.venue}, ${room.name}, ${room.hash}`);
        }
        return room;
    }
    newRecord(venue, name, hash, callback) {
        if (this.assertHasNot(venue, name, hash, callback)) {
            const room = new room_1.Room(venue, name, hash);
            super.add(room);
            console.log(`Added new room to database: ${venue}, ${name}, ${hash}`);
            // "room_opened" is sent in adapter event handler "create-room"
            return room;
        }
    }
}
exports.RoomDB = new RoomInMemoryStore();
//# sourceMappingURL=rooms.js.map