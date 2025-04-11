import { User } from '../models/user';
import { SeminarSocket } from '../server';
import { Callback } from '../types/listenEvents';
import { UserId } from '../types/socket';
import { InMemoryStore } from './inMemoryStore';

class UserInMemoryStore extends InMemoryStore<User> {
    getById(id: UserId): User | undefined {
        return this.store.find((user) => user.id === id);
    }
    assertGetById(id: UserId, callback?: Callback): User | undefined {
        const user = this.getById(id);
        if (!user) {
            console.error(`User not found in DB: ${id}`);
            callback?.(`User not found in DB: ${id}`);
        }
        return user;
    }

    assertHasNotId(id: UserId, callback?: Callback): boolean {
        if (this.getById(id)) {
            console.error(`User already in DB: ${id}`);
            callback?.(`User already in DB: ${id}`);
            return false;
        }
        return true;
    }

    public delete(id: UserId, callback?: Callback): User | undefined {
        const user = this.assertGetById(id, callback);
        if (user) this.remove((item) => item.id === id);
        return user;
    }

    newRecord(
        socket: SeminarSocket,
        name?: string,
        callback?: Callback
    ): User | undefined {
        if (this.assertHasNotId(socket.id, callback)) {
            const user = new User(socket.id, name, {});
            super.add(user);
            console.log(`Added new user to database: ${user.id}`);
            return user;
        }
    }
}

export const UserDB = new UserInMemoryStore();
