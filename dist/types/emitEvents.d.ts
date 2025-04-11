export type MessageEvent = 'message';
export type AnnouncementEvent = 'announcement';
export type MessageContent = {
    [key: string]: unknown;
};
export interface UserPayload {
    id: string;
    name?: string;
}
export interface RoomPayload {
    id: string;
    venue: string;
    name: string;
    hash: string;
}
export interface UserAndRoomPayload {
    user: UserPayload;
    room: RoomPayload;
}
export interface MessagePayload {
    id: string;
    time: string;
    room: RoomPayload;
    sender: UserPayload;
    recipient?: UserPayload;
    copy?: boolean;
    content: MessageContent;
}
export interface ParticipantsPayload {
    participants: UserPayload[];
    hosts: UserPayload[];
    room: RoomPayload;
}
export interface SocketEmitEvents {
    rooms: (payload: RoomPayload[]) => void;
    chair: (payload: RoomPayload) => void;
    announcement: (payload: MessagePayload) => void;
    message: (payload: MessagePayload) => void;
    participants: (payload: ParticipantsPayload) => void;
    room_opened: (payload: RoomPayload) => void;
    room_closed: (payload: RoomPayload) => void;
    entered_room: (payload: UserAndRoomPayload) => void;
    left_room: (payload: UserAndRoomPayload) => void;
    kicked_out: (payload: RoomPayload) => void;
}
