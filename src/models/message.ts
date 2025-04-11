import moment from 'moment';
import { Room } from './room';
import { User } from './user';
import { MessageContent, MessageEvent } from '../types/emitEvents';
import { AnnouncementEvent, Callback } from '../types/listenEvents';
import { SeminarBroadcastOperator } from '../types/socket';
import { SeminarSocket } from '../server';

export class Message {

    public type: MessageEvent | AnnouncementEvent;
    public time: string;
    public room: Room;
    public sender: User;
    public recipient: User | Room;
    public sendCopyToSelf: boolean | undefined;
    public content: MessageContent;

    constructor(
        type: MessageEvent | AnnouncementEvent,
        room: Room,
        sender: User,
        sendCopyToSelf: boolean | undefined,
        content: MessageContent,
        recipient: User | Room
    ) {
        this.type = type;
        this.time = moment().format('hh:mm:ss');
        this.room = room;
        this.sender = sender;
        this.recipient = recipient;
        this.sendCopyToSelf = sendCopyToSelf;
        this.content = content;
    }

    get id(): string {
        return `${this.type}|${this.time}|${this.room.id}|${this.sender.id}|${this.recipient?.id}`;
    }

    toJson() {
        return {
            id: this.id,
            time: this.time,
            room: this.room.toJson(),
            sender: this.sender.toJson(),
            recipient: this.recipient?.toJson(),
            copy: this.sendCopyToSelf,
            content: this.content,
        };
    }

    public sendTo(
        toSocket: SeminarSocket | SeminarBroadcastOperator,
        callback?: Callback
    ): boolean {
        const { sender, recipient, room } = this;
        if (!sender.isInRoom(room)) {
            callback?.(`Sender ${sender.id} is not in room "${room.id}"`);
            console.error(`Sender ${sender.id} is not in room "${room.id}"`);
            return false;
        }
        if (recipient instanceof User && !recipient.isInRoom(room)) {
            callback?.(`Recipient ${recipient.id} is not in room "${room.id}"`);
            console.error(
                `Recipient ${recipient.id} is not in room "${room.id}"`
            );
            return false;
        }
        if (this.type == 'announcement' && !sender.isHost(room)) {
            callback?.('Only hosts can make announcements');
            console.error('Only hosts can make announcements');
            return false;
        }
        toSocket.emit(this.type, this.toJson());
        console.log(
            `User ${sender.id} sent ${this.type} to "${recipient?.id}"`,
            this.content
        );
        if (this.sendCopyToSelf) {
            sender.socket.emit(this.type, this.toJson());
            console.log(`User ${this.id} sent copy of to self`);
        }
        return true;
    }
}
