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
import {MessagesRepository} from './chat/repositories/messages.repository';
import {ChatMessage} from './chat/models/chat.message.model';
import {User} from './chat/models/user.model';
import {GroupMember} from './chat/models/member.model';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    usersDict: { [key: string]: GroupMember; } = {};

    constructor(private messagesRepository: MessagesRepository) {
    }

    @WebSocketServer() server: Server;

    private logger: Logger = new Logger('AppGateway');

    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, message: ChatMessage): void {
        this.logger.debug(`Message: ${message.message} from: ${message.senderId} to room: ${message.channelId}`);
        this.messagesRepository.addMessage(message).then((msg) => {
            this.server.to(message.channelId).emit('msgToClient', msg);
        });
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, member: GroupMember) {
        client.join(member.channelId);
        this.usersDict[client.id] = member;
        const members = Object.values(this.usersDict);
        const usersInRoom = members.filter(u => u.channelId === member.channelId);
        this.logger.log(`Client: ${JSON.stringify(usersInRoom)} in room: ${member.channelId}`);
        this.server.to(member.channelId).emit('joinedRoom', Object.values(usersInRoom));
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, member: GroupMember) {
        client.leave(member.channelId);
        delete this.usersDict[client.id];
        const members = Object.values(this.usersDict);
        if (members) {
            const membersInRoom = members.filter(u => u.channelId === member.channelId);
            this.logger.log(`Member: ${JSON.stringify(membersInRoom)} in room: ${member.channelId}`);
            this.server.to(member.channelId).emit('leftRoom', Object.values(membersInRoom));
        }
    }

    @SubscribeMessage('inviteMember')
    handleInviteMember(client: Socket, data: {id: string, user: User}) {
        this.logger.log(`User ${JSON.stringify(data.user)} invited to the room: ${data.id}`);
        this.server.to(data.id).emit('inviteMember', data);
    }

    @SubscribeMessage('unInviteMember')
    handleUnInviteMember(client: Socket, data: {id: string, user: User}) {
        this.logger.log(`User ${JSON.stringify(data.user)} uninvited`);
        this.server.to(data.id).emit('unInviteMember', data);
    }

    @SubscribeMessage('deleteMessage')
    handleDeleteMessage(client: Socket, message: ChatMessage) {
        this.messagesRepository.deleteMessage(message._id).then( () => {
            this.logger.log(`Message ${JSON.stringify(message)} deleted`);
            this.server.to(message.channelId).emit('deleteMessage', message);
        });
    }

    afterInit(server: Server) {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket) {
        delete this.usersDict[client.id];
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }
}
