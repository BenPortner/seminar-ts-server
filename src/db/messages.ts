import { Message } from '../models/message';
import { Room } from '../models/room';
import { User } from '../models/user';
import { AnnouncementEvent, Callback, MessageContent, MessageEvent } from '../types/listenEvents';
import { InMemoryStore } from './inMemoryStore';

export class MessageInMemoryStore extends InMemoryStore<Message> {
    getById(id: string): Message | undefined {
        return this.store.find((message) => message.id === id);
    }

    assertHasNotId(id: string, callback?: Callback): boolean {
        if (this.getById(id)) {
            console.error(`Message already in DB: ${id}`);
            callback?.(`Message already in DB: ${id}`);
            return false;
        }
        return true;
    }

    newRecord(
        type: MessageEvent | AnnouncementEvent,
        room: Room,
        sender: User,
        sendCopyToSelf: boolean | undefined,
        content: MessageContent,
        recipient: User | Room,
    ): Message {
        const msg = new Message(type, room, sender, sendCopyToSelf, content, recipient);
        super.add(msg);
        console.log('Added new message to database:', msg.toJson());
        return msg;
    }
}

export const MessageDB = new MessageInMemoryStore();
