import { Room } from './room';
import { SeminarSocket } from '../server';
import { Role, RoleMap, RoomId, UserId } from '../types/socket';
export declare class User {
    id: UserId;
    name?: string | undefined;
    roles: RoleMap;
    constructor(id: UserId, name?: string | undefined, roles?: RoleMap);
    get socket(): SeminarSocket;
    isHost(room: Room): boolean;
    isChair(room: Room): boolean;
    setRole(room: Room, role: Role): void;
    deleteRole(room: Room): void;
    get roomIds(): RoomId[];
    isInRoom(room: Room): boolean;
    toJson(): {
        id: string;
        name: string | undefined;
        roles: RoleMap;
    };
}
