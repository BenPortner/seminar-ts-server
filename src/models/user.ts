import { Room } from './room';
import { SeminarServer, SeminarSocket } from '../server';
import { Role, RoleMap, RoomId, UserId } from '../types/socket';

export class User {
    constructor(
        public id: UserId,
        public name?: string,
        public roles: RoleMap = {}
    ) {}

    get socket(): SeminarSocket {
        return SeminarServer.io.socketMap.get(this.id)!;
    }

    public isHost(room: Room): boolean {
        const role = this.roles[room.id];
        return ['host', 'chair'].includes(role);
    }

    public isChair(room: Room): boolean {
        return this.roles[room.id] === 'chair';
    }

    setRole(room: Room, role: Role): void {
        this.roles[room.id] = role;
        if (role === 'chair') {
            this.socket.emit('chair', room.toJson());
        }
        console.log(
            `User ${this.id} got new role "${role}" in room "${room.id}"`
        );
    }

    deleteRole(room: Room): void {
        if (!this.roles[room.id]) {
            console.error(`User ${this.id} has no role in room "${room.id}"`);
            return;
        }
        delete this.roles[room.id];
    }

    get roomIds(): RoomId[] {
        return [...this.socket.rooms].filter((id) => id !== this.id);
    }

    isInRoom(room: Room): boolean {
        return this.roomIds.includes(room.id);
    }

    public toJson() {
        return {
            id: this.id,
            name: this.name,
            roles: this.roles,
        };
    }
}
