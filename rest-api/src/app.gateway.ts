import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import {Logger} from '@nestjs/common';
import {Socket, Server} from 'socket.io';
import {ChatMessage} from '../../shared/chat-message';
import {ChatUser} from '../../shared/chat-user';
import {GroupRepository} from './chat/repositories/group.repository';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    users = {};

    constructor(private groupRepository: GroupRepository) {
    }

    @WebSocketServer() server: Server;

    private logger: Logger = new Logger('AppGateway');

    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, payload: ChatMessage): void {
        this.logger.debug(`Message: ${payload.message} from: ${payload.senderId} to room: ${payload.channelId}`);
        this.server.to(payload.channelId).emit('msgToClient', payload);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, chatUser: ChatUser) {
        client.join(chatUser.channelId);
        this.users[client.id] = chatUser;
        this.logger.log(`Client: ${JSON.stringify(Object.values(this.users))} in room: ${chatUser.channelId}`);
        this.server.to(chatUser.channelId).emit('joinedRoom', Object.values(this.users));
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, chatUser: ChatUser) {
        client.leave(chatUser.channelId);
        delete this.users[client.id];
        this.logger.log(`Client: ${JSON.stringify(Object.values(this.users))} in room: ${chatUser.channelId}`);
        this.server.to(chatUser.channelId).emit('leftRoom', Object.values(this.users));
    }

    afterInit(server: Server) {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket) {
        delete this.users[client.id];
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }
}
