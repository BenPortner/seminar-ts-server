import http from 'http';
import https from 'https';
import { SocketListeners } from './handlers/socketListeners';
import { Server, ServerOptions, DefaultEventsMap, Socket } from 'socket.io';
import { SocketListenEvents } from './types/listenEvents';
import { SocketEmitEvents } from './types/emitEvents';
import { RoomId, SeminarSocketData, UserId } from './types/socket';
import { RoomDB } from './db/rooms';
import { Room } from './models/room';

export class SeminarSocket extends Socket<
    SocketListenEvents,
    SocketEmitEvents,
    DefaultEventsMap,
    SeminarSocketData
> {}

export class SeminarServer extends Server<
    SocketListenEvents,
    SocketEmitEvents,
    DefaultEventsMap,
    SeminarSocketData
> {
    static io: SeminarServer;

    constructor(
        server: http.Server | https.Server,
        options: Partial<ServerOptions> = {}
    ) {
        super(server, options);
        // register event handlers
        this.on('connection', SocketListeners.connect);
    }

    public get socketMap(): Map<UserId, SeminarSocket> {
        return this.of('/').sockets;
    }
    get userIds(): UserId[] {
        return [...this.socketMap.keys()];
    }
    get userSockets(): SeminarSocket[] {
        return [...this.socketMap.values()];
    }
    userExists(id: UserId): boolean {
        return this.socketMap.has(id);
    }
    private get roomMap(): Map<RoomId, Set<UserId>> {
        // THIS MAP INCLUDES ROOMS AS WELL AS USERS!
        return this.of('/').adapter.rooms;
    }
    private get userAndRoomIds(): (UserId | RoomId)[] {
        return [...this.roomMap.keys()];
    }
    get roomIds(): RoomId[] {
        return this.userAndRoomIds.filter((i) => !this.userIds.includes(i));
    }
    get rooms(): Room[] {
        return this.roomIds.map((id) => RoomDB.getById(id)!);
    }
    getUserIdsInRoom(roomId: RoomId): UserId[] {
        const ids = this.roomMap.get(roomId)?.values();
        return ids == undefined ? [] : [...ids];
    }
    getUserSocketsInRoom(roomId: RoomId): SeminarSocket[] {
        return this.getUserIdsInRoom(roomId).map(
            (id) => this.socketMap.get(id)!
        );
    }
}
