export class InMemoryStore<T> {
    protected store: T[] = [];

    // Add an item to the store
    add(item: T): void {
        this.store.push(item);
    }

    // Get all items in the store
    getAll(): T[] {
        return [...this.store]; // Return a copy to prevent external mutation
    }

    // Find an item by a predicate function
    find(predicate: (item: T) => boolean): T | undefined {
        return this.store.find(predicate);
    }

    // Update an item by a predicate function
    update(predicate: (item: T) => boolean, updatedItem: T): boolean {
        const index = this.store.findIndex(predicate);
        if (index !== -1) {
            this.store[index] = updatedItem;
            return true;
        }
        return false;
    }

    // Remove an item by a predicate function
    remove(predicate: (item: T) => boolean): boolean {
        const index = this.store.findIndex(predicate);
        if (index !== -1) {
            this.store.splice(index, 1);
            return true;
        }
        return false;
    }

    // Clear all items from the store
    clear(): void {
        this.store = [];
    }

    // Get the count of items in the store
    count(): number {
        return this.store.length;
    }
}
