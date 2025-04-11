import { Callback, CheckoutPayload, CloseRoomPayload, HostRoomPayload, JoinRoomPayload, LeaveRoomPayload, MessagePayload, SocketListenEvents as ListenEvents, CheckinPayload, AnnouncementPayload } from '../types/listenEvents';
import { SeminarSocket } from '../server';
import { Role } from '../types/socket';
export declare class SocketListeners implements ListenEvents {
    private socket;
    constructor(socket: SeminarSocket);
    static connect(socket: SeminarSocket): void;
    checkin(payload: CheckinPayload, callback?: Callback): void;
    checkout(payload?: CheckoutPayload, callback?: Callback): void;
    host_room(payload: HostRoomPayload, callback?: Callback): void;
    join_room(payload: JoinRoomPayload, callback?: Callback, role?: Role): void;
    private messageOrAnnouncement;
    message(payload: MessagePayload, callback?: Callback): void;
    announcement(payload: AnnouncementPayload, callback?: Callback): void;
    leave_room(payload: LeaveRoomPayload, callback?: Callback): void;
    close_room(payload: CloseRoomPayload, callback?: Callback): void;
    disconnect(): void;
}
