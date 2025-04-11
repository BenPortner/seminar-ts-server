"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const server_1 = require("../server");
class User {
    constructor(id, name, roles = {}) {
        this.id = id;
        this.name = name;
        this.roles = roles;
    }
    get socket() {
        return server_1.SeminarServer.io.socketMap.get(this.id);
    }
    isHost(room) {
        const role = this.roles[room.id];
        return ['host', 'chair'].includes(role);
    }
    isChair(room) {
        return this.roles[room.id] === 'chair';
    }
    setRole(room, role) {
        this.roles[room.id] = role;
        if (role === 'chair') {
            this.socket.emit('chair', room.toJson());
        }
        console.log(`User ${this.id} got new role "${role}" in room "${room.id}"`);
    }
    deleteRole(room) {
        if (!this.roles[room.id]) {
            console.error(`User ${this.id} has no role in room "${room.id}"`);
            return;
        }
        delete this.roles[room.id];
    }
    get roomIds() {
        return [...this.socket.rooms].filter((id) => id !== this.id);
    }
    isInRoom(room) {
        return this.roomIds.includes(room.id);
    }
    toJson() {
        return {
            id: this.id,
            name: this.name,
            roles: this.roles,
        };
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map