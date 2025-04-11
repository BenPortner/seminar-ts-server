import { Room } from './room';
import { User } from './user';
import { MessageContent, MessageEvent } from '../types/emitEvents';
import { AnnouncementEvent, Callback } from '../types/listenEvents';
import { SeminarBroadcastOperator } from '../types/socket';
import { SeminarSocket } from '../server';
export declare class Message {
    type: MessageEvent | AnnouncementEvent;
    time: string;
    room: Room;
    sender: User;
    recipient: User | Room;
    sendCopyToSelf: boolean | undefined;
    content: MessageContent;
    constructor(type: MessageEvent | AnnouncementEvent, room: Room, sender: User, sendCopyToSelf: boolean | undefined, content: MessageContent, recipient: User | Room);
    get id(): string;
    toJson(): {
        id: string;
        time: string;
        room: {
            id: string;
            venue: string;
            name: string;
            hash: string;
        };
        sender: {
            id: string;
            name: string | undefined;
            roles: import("../types/socket").RoleMap;
        };
        recipient: {
            id: string;
            venue: string;
            name: string;
            hash: string;
        } | {
            id: string;
            name: string | undefined;
            roles: import("../types/socket").RoleMap;
        };
        copy: boolean | undefined;
        content: MessageContent;
    };
    sendTo(toSocket: SeminarSocket | SeminarBroadcastOperator, callback?: Callback): boolean;
}
