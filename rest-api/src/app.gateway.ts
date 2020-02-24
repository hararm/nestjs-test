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
import {ChatUser} from '../../shared/chat-user';
import {MessagesRepository} from './chat/repositories/messages.repository';
import {ChatMessage} from './chat/models/chat.message.model';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    users: { [key: string]: ChatUser; } = {};

    constructor(private messagesRepository: MessagesRepository) {
    }

    @WebSocketServer() server: Server;

    private logger: Logger = new Logger('AppGateway');

    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, message: ChatMessage): void {
        this.logger.debug(`Message: ${message.message} from: ${message.senderId} to room: ${message.channelId}`);
        this.messagesRepository.addMessage(message).then(() => {
            this.server.to(message.channelId).emit('msgToClient', message);
        });
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, chatUser: ChatUser) {
        client.join(chatUser.channelId);
        this.users[client.id] = chatUser;
        const users = Object.values(this.users);
        const usersInRoom = users.filter(u => u.channelId === chatUser.channelId);
        this.logger.log(`Client: ${JSON.stringify(usersInRoom)} in room: ${chatUser.channelId}`);
        this.server.to(chatUser.channelId).emit('joinedRoom', Object.values(usersInRoom));
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, chatUser: ChatUser) {
        client.leave(chatUser.channelId);
        delete this.users[client.id];
        const users = Object.values(this.users);
        if (users) {
            const usersInRoom = users.filter(u => u.channelId === chatUser.channelId);
            this.logger.log(`Client: ${JSON.stringify(usersInRoom)} in room: ${chatUser.channelId}`);
            this.server.to(chatUser.channelId).emit('leftRoom', Object.values(usersInRoom));
        }

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
