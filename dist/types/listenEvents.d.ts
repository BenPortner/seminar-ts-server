export type Callback = (error?: string) => void;
export type MessageEvent = 'message';
export type AnnouncementEvent = 'announcement';
export type MessageContent = {
    [key: string]: unknown;
};
export type CheckinPayload = string;
export type CheckoutPayload = undefined;
export interface HostRoomPayload {
    venue: string;
    name: string;
    hash: string;
    secret: string;
}
export interface CloseRoomPayload {
    venue: string;
    name: string;
    hash: string;
    secret: string;
}
export interface JoinRoomPayload {
    venue: string;
    name: string;
    hash: string;
}
export interface LeaveRoomPayload {
    venue: string;
    name: string;
    hash: string;
}
export interface MessagePayload {
    venue: string;
    name: string;
    hash: string;
    recipient?: string | boolean;
    copy?: boolean;
    content: MessageContent;
}
export interface AnnouncementPayload {
    venue: string;
    name: string;
    hash: string;
    recipient?: string | boolean;
    copy?: boolean;
    content: MessageContent;
}
export interface SocketListenEvents {
    checkin: (payload: CheckinPayload, callback?: Callback) => void;
    checkout: (payload: CheckoutPayload, callback?: Callback) => void;
    host_room: (payload: HostRoomPayload, callback?: Callback) => void;
    close_room: (payload: CloseRoomPayload, callback?: Callback) => void;
    join_room: (payload: JoinRoomPayload, callback?: Callback) => void;
    leave_room: (payload: LeaveRoomPayload, callback?: Callback) => void;
    message: (payload: MessagePayload, callback?: Callback) => void;
    announcement: (payload: AnnouncementPayload, callback?: Callback) => void;
    disconnect: () => void;
}
