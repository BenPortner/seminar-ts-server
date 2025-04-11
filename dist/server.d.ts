import http from 'http';
import https from 'https';
import { Server, ServerOptions, DefaultEventsMap, Socket } from 'socket.io';
import { SocketListenEvents } from './types/listenEvents';
import { SocketEmitEvents } from './types/emitEvents';
import { RoomId, SeminarSocketData, UserId } from './types/socket';
import { Room } from './models/room';
export declare class SeminarSocket extends Socket<SocketListenEvents, SocketEmitEvents, DefaultEventsMap, SeminarSocketData> {
}
export declare class SeminarServer extends Server<SocketListenEvents, SocketEmitEvents, DefaultEventsMap, SeminarSocketData> {
    static io: SeminarServer;
    constructor(server: http.Server | https.Server, options?: Partial<ServerOptions>);
    get socketMap(): Map<UserId, SeminarSocket>;
    get userIds(): UserId[];
    get userSockets(): SeminarSocket[];
    userExists(id: UserId): boolean;
    private get roomMap();
    private get userAndRoomIds();
    get roomIds(): RoomId[];
    get rooms(): Room[];
    getUserIdsInRoom(roomId: RoomId): UserId[];
    getUserSocketsInRoom(roomId: RoomId): SeminarSocket[];
}
