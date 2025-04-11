import {
    Callback,
    MessageEvent,
    AnnouncementEvent,
    CheckoutPayload,
    CloseRoomPayload,
    HostRoomPayload,
    JoinRoomPayload,
    LeaveRoomPayload,
    MessagePayload,
    SocketListenEvents as ListenEvents,
    CheckinPayload,
    AnnouncementPayload,
} from '../types/listenEvents';
import { validate } from '../utils/crypt';
import { SeminarServer, SeminarSocket } from '../server';
import { Role } from '../types/socket';
import { RoomDB } from '../db/rooms';
import { UserDB } from '../db/users';
import { MessageDB } from '../db/messages';


export class SocketListeners implements ListenEvents {
    private socket: SeminarSocket;

    constructor(socket: SeminarSocket) {
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

    static connect(socket: SeminarSocket): void {
        console.log(`${socket.id} connected`);
        // send list of rooms to the client
        socket.emit(
            'rooms',
            SeminarServer.io.rooms.map((r) => r.toJson())
        );
        // register event handlers
        new SocketListeners(socket);
    }

    checkin(payload: CheckinPayload, callback?: Callback): void {
        const user = UserDB.newRecord(this.socket, payload, callback);
        if (!user) return;
        console.log(`User ${user.id} checked in`);
        callback?.();
    }

    checkout(payload?: CheckoutPayload, callback?: Callback): void {
        const user = UserDB.delete(this.socket.id, callback);
        if (!user) return;
        console.log(`User ${user.id} checked out`);
        callback?.();
    }

    host_room(payload: HostRoomPayload, callback?: Callback): void {
        const { venue, name, hash, secret } = payload;
        if (!validate(venue, name, hash, secret, callback)) return;
        const room = RoomDB.get(venue, name, hash);
        if (!room) RoomDB.newRecord(venue, name, hash, callback);
        const role = room ? 'host' : 'chair';
        this.join_room({ venue, name, hash }, callback, role);
        callback?.();
    }

    join_room(
        payload: JoinRoomPayload,
        callback?: Callback,
        role: Role = 'participant'
    ): void {
        const { venue, name, hash } = payload;
        const room = RoomDB.assertGet(venue, name, hash, callback);
        const user = UserDB.assertGetById(this.socket.id)!;
        if (!room || !user) return;
        if (role) user.setRole(room, role);
        this.socket.join(room.id); // fires adapter events "join-room" / "create-room"
        callback?.();
    }

    private messageOrAnnouncement(
        payload: MessagePayload,
        messageType: MessageEvent | AnnouncementEvent,
        callback?: Callback
    ): boolean {
        const sender = UserDB.assertGetById(this.socket.id);
        const { venue, name, hash, recipient, copy, content } = payload;
        const room = RoomDB.assertGet(venue, name, hash, callback);
        if (!room || !sender) return false;
        let realRecipient;
        let realRecipientSocket;
        if (!recipient) {
            // send to room
            realRecipient = room;
            realRecipientSocket = sender.socket.to(room.id);
        } else {
            if (recipient === true) {
                // send to chair
                realRecipient = room.chair;
                if (!realRecipient) {
                    callback?.(`Room ${room.id} has no chair`);
                    console.error(`Room ${room.id} has no chair`);
                    return false;
                }
                realRecipientSocket = SeminarServer.io.to(realRecipient.id);
            } else {
                // send to user
                realRecipient = UserDB.assertGetById(recipient, callback);
                if (!realRecipient) return false;
                realRecipientSocket = SeminarServer.io.to(realRecipient.id);
            }
        }
        MessageDB.newRecord(
            messageType,
            room,
            sender,
            copy,
            content,
            realRecipient
        ).sendTo(realRecipientSocket, callback);
        return true;
    }

    message(payload: MessagePayload, callback?: Callback): void {
        this.messageOrAnnouncement(payload, 'message', callback);
        callback?.();
    }
    announcement(payload: AnnouncementPayload, callback?: Callback): void {
        this.messageOrAnnouncement(payload, 'announcement', callback);
        callback?.();
    }

    leave_room(payload: LeaveRoomPayload, callback?: Callback): void {
        const userId = this.socket.id;
        const { venue, name, hash } = payload;
        const user = UserDB.assertGetById(userId, callback);
        const room = RoomDB.assertGet(venue, name, hash, callback);
        if (!room || !user) return;        
        this.socket.leave(room.id); // triggers adapter "leave-room" event
        callback?.();
    }

    close_room(payload: CloseRoomPayload, callback?: Callback): void {
        const { venue, name, hash, secret } = payload;
        if (!validate(venue, name, hash, secret, callback)) return;
        const room = RoomDB.assertGet(venue, name, hash, callback);
        if (!room) return;
        SeminarServer.io.to(room.id).emit('kicked_out', room.toJson());
        SeminarServer.io.socketsLeave(room.id); // triggers adapter "leave-room" and "delete-room"
        callback?.();
    }

    disconnect(): void {
        this.checkout();
    }
}
