import { Message } from '../models/message';
import { Room } from '../models/room';
import { User } from '../models/user';
import { AnnouncementEvent, Callback, MessageContent, MessageEvent } from '../types/listenEvents';
import { InMemoryStore } from './inMemoryStore';
export declare class MessageInMemoryStore extends InMemoryStore<Message> {
    getById(id: string): Message | undefined;
    assertHasNotId(id: string, callback?: Callback): boolean;
    newRecord(type: MessageEvent | AnnouncementEvent, room: Room, sender: User, sendCopyToSelf: boolean | undefined, content: MessageContent, recipient: User | Room): Message;
}
export declare const MessageDB: MessageInMemoryStore;
