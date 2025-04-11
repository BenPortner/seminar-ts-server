import { User } from './user';
import { SeminarServer, SeminarSocket } from '../server';
import { UserId } from '../types/socket';
import { UserDB } from '../db/users';

export class Room {
    constructor(
        public venue: string,
        public name: string,
        public hash: string
    ) {}

    get id(): string {
        return `${this.venue}|${this.name}|${this.hash}`;
    }

    protected get userIds(): UserId[] {
        return SeminarServer.io.getUserIdsInRoom(this.id);
    }

    get isEmpty(): boolean {
        return this.userIds.length === 0;
    }

    protected get userSockets(): SeminarSocket[] {
        return SeminarServer.io.getUserSocketsInRoom(this.id);
    }

    get users(): User[] {
        return this.userSockets.map((s) => UserDB.getById(s.id)!);
    }

    get hosts(): User[] {
        return this.users.filter((u) => u.isHost(this));
    }

    get chair(): User | undefined {
        const chairs = this.users.filter((u) => u.isChair(this));
        if (chairs.length === 0) return;
        else return chairs[0];
    }

    findNewChair(): User | undefined {
        const newChair = this.hosts[0];
        if (!newChair) {
            console.log(`Room ${this.id} has no hosts`);
            return;
        }
        if (newChair.isChair(this)) {
            console.log(`User ${newChair.id} is still chair`);
            return;
        }
        newChair.setRole(this, 'chair');
        return newChair;
    }

    toJson() {
        return {
            id: this.id,
            venue: this.venue,
            name: this.name,
            hash: this.hash,
        };
    }
}
