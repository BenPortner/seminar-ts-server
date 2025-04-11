"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDB = void 0;
const user_1 = require("../models/user");
const inMemoryStore_1 = require("./inMemoryStore");
class UserInMemoryStore extends inMemoryStore_1.InMemoryStore {
    getById(id) {
        return this.store.find((user) => user.id === id);
    }
    assertGetById(id, callback) {
        const user = this.getById(id);
        if (!user) {
            console.error(`User not found in DB: ${id}`);
            callback === null || callback === void 0 ? void 0 : callback(`User not found in DB: ${id}`);
        }
        return user;
    }
    assertHasNotId(id, callback) {
        if (this.getById(id)) {
            console.error(`User already in DB: ${id}`);
            callback === null || callback === void 0 ? void 0 : callback(`User already in DB: ${id}`);
            return false;
        }
        return true;
    }
    delete(id, callback) {
        const user = this.assertGetById(id, callback);
        if (user)
            this.remove((item) => item.id === id);
        return user;
    }
    newRecord(socket, name, callback) {
        if (this.assertHasNotId(socket.id, callback)) {
            const user = new user_1.User(socket.id, name, {});
            super.add(user);
            console.log(`Added new user to database: ${user.id}`);
            return user;
        }
    }
}
exports.UserDB = new UserInMemoryStore();
//# sourceMappingURL=users.js.map