export declare class InMemoryStore<T> {
    protected store: T[];
    add(item: T): void;
    getAll(): T[];
    find(predicate: (item: T) => boolean): T | undefined;
    update(predicate: (item: T) => boolean, updatedItem: T): boolean;
    remove(predicate: (item: T) => boolean): boolean;
    clear(): void;
    count(): number;
}
