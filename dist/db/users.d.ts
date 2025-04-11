import { User } from '../models/user';
import { SeminarSocket } from '../server';
import { Callback } from '../types/listenEvents';
import { UserId } from '../types/socket';
import { InMemoryStore } from './inMemoryStore';
declare class UserInMemoryStore extends InMemoryStore<User> {
    getById(id: UserId): User | undefined;
    assertGetById(id: UserId, callback?: Callback): User | undefined;
    assertHasNotId(id: UserId, callback?: Callback): boolean;
    delete(id: UserId, callback?: Callback): User | undefined;
    newRecord(socket: SeminarSocket, name?: string, callback?: Callback): User | undefined;
}
export declare const UserDB: UserInMemoryStore;
export {};
