import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import {Logger, UseGuards} from '@nestjs/common';
import {Socket, Server} from 'socket.io';
import {MessagesRepositoryService} from './chat/repositories/messages.repository.service';
import {ChatMessage} from './chat/models/chat.message.model';
import {User} from './chat/models/user.model';
import {Account} from './chat/models/account.model';
import {WsJwtGuard} from './guards/ws-jwt.guard';
import {GroupRepositoryService} from './chat/repositories/group.repository.service';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    usersDict: { [key: string]: Account; } = {};

    constructor(private messagesRepository: MessagesRepositoryService, private groupRepository: GroupRepositoryService) {
    }

    @WebSocketServer() server: Server;

    private logger: Logger = new Logger('AppGateway');

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('msgToServer')
    handleMessage(@ConnectedSocket() client: Socket, @MessageBody() message: ChatMessage): void {
        this.logger.debug(`Message: ${message.message} from: ${message.senderId} to room: ${message.channelId}`);
        this.messagesRepository.addMessage(message).then((msg) => {
            this.server.to(message.channelId).emit('msgToClient', msg);
        });
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('joinRoom')
    handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody()member: Account) {
        client.join(member.channelId);
        this.usersDict[client.id] = member;
        const members = Object.values(this.usersDict);
        this.logger.log(`Client: ${JSON.stringify(members)} in room: ${member.channelId}`);
        this.server.to(member.channelId).emit('joinedRoom', Object.values(members));
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() member: Account) {
        client.leave(member.channelId);
        delete this.usersDict[client.id];
        const members = Object.values(this.usersDict);
        if (members) {
            const membersInRoom = members.filter(u => u.channelId === member.channelId);
            this.logger.log(`Member: ${JSON.stringify(membersInRoom)} in room: ${member.channelId}`);
            this.server.to(member.channelId).emit('leftRoom', Object.values(membersInRoom));
        }
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('inviteMember')
    handleInviteMember(@ConnectedSocket() client: Socket, @MessageBody() data: {id: string, user: User}) {
        this.logger.log(`User ${JSON.stringify(data.user)} invited to the room: ${data.id}`);
        this.groupRepository.addMembersToGroup(data.id, data.id).then(() => {
            this.server.emit('inviteMember', data);
        });

    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('unInviteMember')
    handleUnInviteMember(@ConnectedSocket() client: Socket, @MessageBody() data: {id: string, user: User}) {
        this.logger.log(`User ${JSON.stringify(data.user)} uninvited`);
        this.groupRepository.removeMembersToGroup(data.id, data.id).then(() => {
            this.server.emit('unInviteMember', data);
        });
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('deleteMessage')
    handleDeleteMessage(@ConnectedSocket() client: Socket, @MessageBody() message: ChatMessage) {
        this.messagesRepository.deleteMessage(message._id).then( () => {
            this.logger.log(`Message ${JSON.stringify(message)} deleted`);
            this.server.to(message.channelId).emit('deleteMessage', message);
        });
    }

    afterInit(server: Server) {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket) {
        const user = this.usersDict[client.id];
        if (user) {
            this.server.emit('userOffline', user._id);
            delete this.usersDict[client.id];
            this.logger.log(`Client disconnected: ${client.id}`);
        }
    }

    handleConnection(client: Socket, ...args: any[]) {
        const userId = client.handshake.query['userId'];
        const userLogin = client.handshake.query['userLogin'];
        this.usersDict[client.id] = new Account(userLogin, userLogin, null, true, userId);
        this.logger.log(`Client Data args: ${userId}, ${userLogin}`);
        this.server.emit('userOnline', userId);
    }
}
