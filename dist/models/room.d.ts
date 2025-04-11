import { User } from './user';
import { SeminarSocket } from '../server';
import { UserId } from '../types/socket';
export declare class Room {
    venue: string;
    name: string;
    hash: string;
    constructor(venue: string, name: string, hash: string);
    get id(): string;
    protected get userIds(): UserId[];
    get isEmpty(): boolean;
    protected get userSockets(): SeminarSocket[];
    get users(): User[];
    get hosts(): User[];
    get chair(): User | undefined;
    findNewChair(): User | undefined;
    toJson(): {
        id: string;
        venue: string;
        name: string;
        hash: string;
    };
}
