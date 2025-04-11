import { BroadcastOperator } from 'socket.io';
import { SocketEmitEvents } from './emitEvents';
export type Role = 'participant' | 'host' | 'chair';
export type RoomId = string;
export type RoleMap = {
    [key: RoomId]: Role;
};
export type UserId = string;
export type SeminarBroadcastOperator = BroadcastOperator<SocketEmitEvents, SeminarSocketData>;
export interface SeminarSocketData {
    name?: string;
    roles: RoleMap;
}
