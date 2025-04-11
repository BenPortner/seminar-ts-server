"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const server_1 = require("../server");
const users_1 = require("../db/users");
class Room {
    constructor(venue, name, hash) {
        this.venue = venue;
        this.name = name;
        this.hash = hash;
    }
    get id() {
        return `${this.venue}|${this.name}|${this.hash}`;
    }
    get userIds() {
        return server_1.SeminarServer.io.getUserIdsInRoom(this.id);
    }
    get isEmpty() {
        return this.userIds.length === 0;
    }
    get userSockets() {
        return server_1.SeminarServer.io.getUserSocketsInRoom(this.id);
    }
    get users() {
        return this.userSockets.map((s) => users_1.UserDB.getById(s.id));
    }
    get hosts() {
        return this.users.filter((u) => u.isHost(this));
    }
    get chair() {
        const chairs = this.users.filter((u) => u.isChair(this));
        if (chairs.length === 0)
            return;
        else
            return chairs[0];
    }
    findNewChair() {
        const newChair = this.hosts[0];
        if (!newChair) {
            console.log(`Room ${this.id} has no hosts`);
            return;
        }
        if (newChair.isChair(this)) {
            console.log(`User ${newChair.id} is still chair`);
            return;
        }
        newChair.setRole(this, 'chair');
        return newChair;
    }
    toJson() {
        return {
            id: this.id,
            venue: this.venue,
            name: this.name,
            hash: this.hash,
        };
    }
}
exports.Room = Room;
//# sourceMappingURL=room.js.map