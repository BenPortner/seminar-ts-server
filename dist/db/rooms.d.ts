import { Room } from '../models/room';
import { Callback } from '../types/listenEvents';
import { RoomId } from '../types/socket';
import { InMemoryStore } from './inMemoryStore';
declare class RoomInMemoryStore extends InMemoryStore<Room> {
    getById(id: RoomId): Room | undefined;
    assertGetById(id: RoomId, callback?: Callback): Room | undefined;
    get(venue: string, name: string, hash: string): Room | undefined;
    assertGet(venue: string, name: string, hash: string, callback?: Callback): Room | undefined;
    assertHasNot(venue: string, name: string, hash: string, callback?: Callback): boolean;
    delete(id: RoomId, callback?: Callback): Room | undefined;
    newRecord(venue: string, name: string, hash: string, callback?: Callback): Room | undefined;
}
export declare const RoomDB: RoomInMemoryStore;
export {};
