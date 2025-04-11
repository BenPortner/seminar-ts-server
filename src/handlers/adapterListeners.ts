import { Adapter } from 'socket.io-adapter';
import { RoomId, UserId } from '../types/socket';
import { SeminarServer } from '../server';
import { RoomDB } from '../db/rooms';
import { UserDB } from '../db/users';

export class AdapterListeners {
    static initialize(adapter: Adapter) {
        // register adapter event handlers
        adapter.on('create-room', (roomId: RoomId) => {
            if (SeminarServer.io.userExists(roomId)) {
                // a user was created
                // this fires before socket.on('connect')
                return;
            }
            // a room was created
            console.log(`Room ${roomId} created`);
            const room = RoomDB.assertGetById(roomId);
            if (!room) return;
            SeminarServer.io.emit('room_opened', room.toJson());
        });
        adapter.on('delete-room', (roomId: RoomId) => {
            // check if it is a room or a user
            if (SeminarServer.io.userExists(roomId)) {
                // a user was deleted
                return;
            }
            // a room was deleted
            console.log(`Room ${roomId} deleted`);
            const room = RoomDB.delete(roomId);
            if (!room) return;
            SeminarServer.io.emit('room_closed', room.toJson());
        });
        adapter.on('join-room', (roomId: RoomId, userId: UserId) => {
            if (roomId === userId) {
                // a user was created
                // this fires before socket.on('connect')
                return;
            }
            console.log(`User ${userId} has joined room ${roomId}`);
            const user = UserDB.assertGetById(userId)!;
            const room = RoomDB.assertGetById(roomId);
            if (!user || !room) return;
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
        adapter.on('leave-room', (roomId: RoomId, userId: UserId) => {
            if (roomId === userId) {
                // a user was deleted
                return;
            }
            // a user left a room
            console.log(`User ${userId} has left room ${roomId}`);
            const user = UserDB.assertGetById(userId)!;
            const room = RoomDB.assertGetById(roomId);
            if (!user || !room) return;
            // inform other room members
            SeminarServer.io.to(roomId).emit('left_room', {
                room: room.toJson(),
                user: user.toJson(),
            });
            // update roles
            user.deleteRole(room);
            const newChair = room.findNewChair();
            if (!newChair) return;
            // inform new chair
            SeminarServer.io.to(newChair.id).emit('chair', room.toJson());
        });
    }
}