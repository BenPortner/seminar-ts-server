"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketListeners = void 0;
const crypt_1 = require("../utils/crypt");
const server_1 = require("../server");
const rooms_1 = require("../db/rooms");
const users_1 = require("../db/users");
const messages_1 = require("../db/messages");
class SocketListeners {
    constructor(socket) {
        this.socket = socket;
        // make sure that "this" refers to the class instance
        // and not to the socket
        this.checkin = this.checkin.bind(this);
        this.checkout = this.checkout.bind(this);
        this.host_room = this.host_room.bind(this);
        this.join_room = this.join_room.bind(this);
        this.leave_room = this.leave_room.bind(this);
        this.message = this.message.bind(this);
        this.announcement = this.announcement.bind(this);
        this.close_room = this.close_room.bind(this);
        this.disconnect = this.disconnect.bind(this);
        // Register event handlers
        socket.on('checkin', this.checkin);
        socket.on('checkout', this.checkout);
        socket.on('host_room', this.host_room);
        socket.on('join_room', this.join_room);
        socket.on('leave_room', this.leave_room);
        socket.on('message', this.message);
        socket.on('announcement', this.announcement);
        socket.on('close_room', this.close_room);
        socket.on('disconnect', this.disconnect);
    }
    static connect(socket) {
        console.log(`${socket.id} connected`);
        // send list of rooms to the client
        socket.emit('rooms', server_1.SeminarServer.io.rooms.map((r) => r.toJson()));
        // register event handlers
        new SocketListeners(socket);
    }
    checkin(payload, callback) {
        const user = users_1.UserDB.newRecord(this.socket, payload, callback);
        if (!user)
            return;
        console.log(`User ${user.id} checked in`);
        callback === null || callback === void 0 ? void 0 : callback();
    }
    checkout(payload, callback) {
        const user = users_1.UserDB.delete(this.socket.id, callback);
        if (!user)
            return;
        console.log(`User ${user.id} checked out`);
        callback === null || callback === void 0 ? void 0 : callback();
    }
    host_room(payload, callback) {
        const { venue, name, hash, secret } = payload;
        if (!(0, crypt_1.validate)(venue, name, hash, secret, callback))
            return;
        const room = rooms_1.RoomDB.get(venue, name, hash);
        if (!room)
            rooms_1.RoomDB.newRecord(venue, name, hash, callback);
        const role = room ? 'host' : 'chair';
        this.join_room({ venue, name, hash }, callback, role);
        callback === null || callback === void 0 ? void 0 : callback();
    }
    join_room(payload, callback, role = 'participant') {
        const { venue, name, hash } = payload;
        const room = rooms_1.RoomDB.assertGet(venue, name, hash, callback);
        const user = users_1.UserDB.assertGetById(this.socket.id);
        if (!room || !user)
            return;
        if (role)
            user.setRole(room, role);
        this.socket.join(room.id); // fires adapter events "join-room" / "create-room"
        callback === null || callback === void 0 ? void 0 : callback();
    }
    messageOrAnnouncement(payload, messageType, callback) {
        const sender = users_1.UserDB.assertGetById(this.socket.id);
        const { venue, name, hash, recipient, copy, content } = payload;
        const room = rooms_1.RoomDB.assertGet(venue, name, hash, callback);
        if (!room || !sender)
            return false;
        let realRecipient;
        let realRecipientSocket;
        if (!recipient) {
            // send to room
            realRecipient = room;
            realRecipientSocket = sender.socket.to(room.id);
        }
        else {
            if (recipient === true) {
                // send to chair
                realRecipient = room.chair;
                if (!realRecipient) {
                    callback === null || callback === void 0 ? void 0 : callback(`Room ${room.id} has no chair`);
                    console.error(`Room ${room.id} has no chair`);
                    return false;
                }
                realRecipientSocket = server_1.SeminarServer.io.to(realRecipient.id);
            }
            else {
                // send to user
                realRecipient = users_1.UserDB.assertGetById(recipient, callback);
                if (!realRecipient)
                    return false;
                realRecipientSocket = server_1.SeminarServer.io.to(realRecipient.id);
            }
        }
        messages_1.MessageDB.newRecord(messageType, room, sender, copy, content, realRecipient).sendTo(realRecipientSocket, callback);
        return true;
    }
    message(payload, callback) {
        this.messageOrAnnouncement(payload, 'message', callback);
        callback === null || callback === void 0 ? void 0 : callback();
    }
    announcement(payload, callback) {
        this.messageOrAnnouncement(payload, 'announcement', callback);
        callback === null || callback === void 0 ? void 0 : callback();
    }
    leave_room(payload, callback) {
        const userId = this.socket.id;
        const { venue, name, hash } = payload;
        const user = users_1.UserDB.assertGetById(userId, callback);
        const room = rooms_1.RoomDB.assertGet(venue, name, hash, callback);
        if (!room || !user)
            return;
        this.socket.leave(room.id); // triggers adapter "leave-room" event
        callback === null || callback === void 0 ? void 0 : callback();
    }
    close_room(payload, callback) {
        const { venue, name, hash, secret } = payload;
        if (!(0, crypt_1.validate)(venue, name, hash, secret, callback))
            return;
        const room = rooms_1.RoomDB.assertGet(venue, name, hash, callback);
        if (!room)
            return;
        server_1.SeminarServer.io.to(room.id).emit('kicked_out', room.toJson());
        server_1.SeminarServer.io.socketsLeave(room.id); // triggers adapter "leave-room" and "delete-room"
        callback === null || callback === void 0 ? void 0 : callback();
    }
    disconnect() {
        this.checkout();
    }
}
exports.SocketListeners = SocketListeners;
//# sourceMappingURL=socketListeners.js.map