"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterListeners = void 0;
const server_1 = require("../server");
const rooms_1 = require("../db/rooms");
const users_1 = require("../db/users");
class AdapterListeners {
    static initialize(adapter) {
        // register adapter event handlers
        adapter.on('create-room', (roomId) => {
            if (server_1.SeminarServer.io.userExists(roomId)) {
                // a user was created
                // this fires before socket.on('connect')
                return;
            }
            // a room was created
            console.log(`Room ${roomId} created`);
            const room = rooms_1.RoomDB.assertGetById(roomId);
            if (!room)
                return;
            server_1.SeminarServer.io.emit('room_opened', room.toJson());
        });
        adapter.on('delete-room', (roomId) => {
            // check if it is a room or a user
            if (server_1.SeminarServer.io.userExists(roomId)) {
                // a user was deleted
                return;
            }
            // a room was deleted
            console.log(`Room ${roomId} deleted`);
            const room = rooms_1.RoomDB.delete(roomId);
            if (!room)
                return;
            server_1.SeminarServer.io.emit('room_closed', room.toJson());
        });
        adapter.on('join-room', (roomId, userId) => {
            if (roomId === userId) {
                // a user was created
                // this fires before socket.on('connect')
                return;
            }
            console.log(`User ${userId} has joined room ${roomId}`);
            const user = users_1.UserDB.assertGetById(userId);
            const room = rooms_1.RoomDB.assertGetById(roomId);
            if (!user || !room)
                return;
            // inform other room members
            user.socket.to(roomId).emit('entered_room', {
                user: user.toJson(),
                room: room.toJson(),
            });
            // send participant list to user
            user.socket.emit('participants', {
                participants: room.users.map((p) => p.toJson()),
                room: room.toJson(),
                hosts: room.hosts.map((h) => h.toJson()),
            });
        });
        adapter.on('leave-room', (roomId, userId) => {
            if (roomId === userId) {
                // a user was deleted
                return;
            }
            // a user left a room
            console.log(`User ${userId} has left room ${roomId}`);
            const user = users_1.UserDB.assertGetById(userId);
            const room = rooms_1.RoomDB.assertGetById(roomId);
            if (!user || !room)
                return;
            // inform other room members
            server_1.SeminarServer.io.to(roomId).emit('left_room', {
                room: room.toJson(),
                user: user.toJson(),
            });
            // update roles
            user.deleteRole(room);
            const newChair = room.findNewChair();
            if (!newChair)
                return;
            // inform new chair
            server_1.SeminarServer.io.to(newChair.id).emit('chair', room.toJson());
        });
    }
}
exports.AdapterListeners = AdapterListeners;
//# sourceMappingURL=adapterListeners.js.map