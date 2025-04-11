import { Room } from '../models/room';
import { Callback } from '../types/listenEvents';
import { RoomId } from '../types/socket';
import { InMemoryStore } from './inMemoryStore';

class RoomInMemoryStore extends InMemoryStore<Room> {
    getById(id: RoomId): Room | undefined {
        return this.store.find((room) => room.id === id);
    }
    assertGetById(id: RoomId, callback?: Callback): Room | undefined {
        const room = this.getById(id);
        if (!room) {
            console.error(`Room not found in DB: ${id}`);
            callback?.(`Room not found in DB: ${id}`);
        }
        return room;
    }
    get(venue: string, name: string, hash: string): Room | undefined {
        return this.store.find(
            (room) =>
                room.venue === venue && room.name === name && room.hash === hash
        );
    }
    assertGet(
        venue: string,
        name: string,
        hash: string,
        callback?: Callback
    ): Room | undefined {
        const room = this.get(venue, name, hash);
        if (!room) {
            console.error(`Room not found in DB: ${venue} ${name} ${hash}`);
            callback?.(`Room not found in DB: ${venue} ${name} ${hash}`);
        }
        return room;
    }

    assertHasNot(
        venue: string,
        name: string,
        hash: string,
        callback?: Callback
    ): boolean {
        if (this.get(venue, name, hash)) {
            console.error(`Room already in DB: ${venue} ${name} ${hash}`);
            callback?.(`Room already in DB: ${venue} ${name} ${hash}`);
            return false;
        }
        return true;
    }

    public delete(id: RoomId, callback?: Callback): Room | undefined {
        const room = this.assertGetById(id, callback);
        if (room) {
            this.remove((item) => item.id === id);
            console.log(
                `Deleted room from database: ${room.venue}, ${room.name}, ${room.hash}`
            );
        }
        return room;
    }

    newRecord(
        venue: string,
        name: string,
        hash: string,
        callback?: Callback
    ): Room | undefined {
        if (this.assertHasNot(venue, name, hash, callback)) {
            const room = new Room(venue, name, hash);
            super.add(room);
            console.log(
                `Added new room to database: ${venue}, ${name}, ${hash}`
            );
            // "room_opened" is sent in adapter event handler "create-room"
            return room;
        }
    }
}

export const RoomDB = new RoomInMemoryStore();
