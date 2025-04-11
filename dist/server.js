"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeminarServer = exports.SeminarSocket = void 0;
const socketListeners_1 = require("./handlers/socketListeners");
const socket_io_1 = require("socket.io");
const rooms_1 = require("./db/rooms");
class SeminarSocket extends socket_io_1.Socket {
}
exports.SeminarSocket = SeminarSocket;
class SeminarServer extends socket_io_1.Server {
    constructor(server, options = {}) {
        super(server, options);
        // register event handlers
        this.on('connection', socketListeners_1.SocketListeners.connect);
    }
    get socketMap() {
        return this.of('/').sockets;
    }
    get userIds() {
        return [...this.socketMap.keys()];
    }
    get userSockets() {
        return [...this.socketMap.values()];
    }
    userExists(id) {
        return this.socketMap.has(id);
    }
    get roomMap() {
        // THIS MAP INCLUDES ROOMS AS WELL AS USERS!
        return this.of('/').adapter.rooms;
    }
    get userAndRoomIds() {
        return [...this.roomMap.keys()];
    }
    get roomIds() {
        return this.userAndRoomIds.filter((i) => !this.userIds.includes(i));
    }
    get rooms() {
        return this.roomIds.map((id) => rooms_1.RoomDB.getById(id));
    }
    getUserIdsInRoom(roomId) {
        var _a;
        const ids = (_a = this.roomMap.get(roomId)) === null || _a === void 0 ? void 0 : _a.values();
        return ids == undefined ? [] : [...ids];
    }
    getUserSocketsInRoom(roomId) {
        return this.getUserIdsInRoom(roomId).map((id) => this.socketMap.get(id));
    }
}
exports.SeminarServer = SeminarServer;
//# sourceMappingURL=server.js.map