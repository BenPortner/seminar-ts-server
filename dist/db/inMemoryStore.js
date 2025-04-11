"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryStore = void 0;
class InMemoryStore {
    constructor() {
        this.store = [];
    }
    // Add an item to the store
    add(item) {
        this.store.push(item);
    }
    // Get all items in the store
    getAll() {
        return [...this.store]; // Return a copy to prevent external mutation
    }
    // Find an item by a predicate function
    find(predicate) {
        return this.store.find(predicate);
    }
    // Update an item by a predicate function
    update(predicate, updatedItem) {
        const index = this.store.findIndex(predicate);
        if (index !== -1) {
            this.store[index] = updatedItem;
            return true;
        }
        return false;
    }
    // Remove an item by a predicate function
    remove(predicate) {
        const index = this.store.findIndex(predicate);
        if (index !== -1) {
            this.store.splice(index, 1);
            return true;
        }
        return false;
    }
    // Clear all items from the store
    clear() {
        this.store = [];
    }
    // Get the count of items in the store
    count() {
        return this.store.length;
    }
}
exports.InMemoryStore = InMemoryStore;
//# sourceMappingURL=inMemoryStore.js.map