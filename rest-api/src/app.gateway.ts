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

@WebSocketGateway()
export class AppGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private logger: Logger = new Logger('AppGateway');

    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, payload: ChatMessage): void {
        this.logger.debug(`Message: ${payload.message} from: ${payload.senderId} to room: ${payload.channelId}`);
        this.server.to(payload.channelId).emit('msgToClient', payload);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, room: string) {
      client.join(room);
      this.logger.log(`Client joined room:: ${room}`);
      client.emit('joinedRoom', room);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, room: string) {
      client.leave(room);
      this.logger.log(`Client left room:: ${room}`);
      client.emit('leftRoom', room);
    }

    afterInit(server: Server) {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
        this.logger.log(`Client connected Args: ${JSON.stringify(args)}`);
    }
}
