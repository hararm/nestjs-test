import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from '../../../environments/environment';
import {Observable, Subject} from 'rxjs';
import Socket = SocketIOClient.Socket;


@Injectable()
export class WebsocketService {

  // Our socket connection
  private socket: Socket;

  constructor() {
  }

  connect(userId: string, userLogin: string) {
    if (!this.socket || !this.socket.connected) {
      this.socket = io.connect(environment.ws_url, {autoConnect: true, rejectUnauthorized: true, query: {userId, userLogin}});
    }
  }

  disconnect() {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
    }
  }

  subscribeToDisconnectEvent(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('disconnect', () => {
        obs.next();
      });
    });
  }

  subscribeToJoinedToRoomEvent(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('joinedRoom', (data) => {
        obs.next(data);
      });
    });
  }

  subscribeToLeftRoomEvent(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('leftRoom', (data) => {
        obs.next(data);
      });
    });
  }

  subscribeToInviteMember(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('inviteMember', (data) => {
        obs.next(data);
      });
    });
  }

  subscribeToUnInviteMember(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('unInviteMember', (data) => {
        obs.next(data);
      });
    });
  }

  subscribeToClientMessagesEvents(): Subject<MessageEvent> {
    const observable = new Observable(obs => {
      this.socket.on('msgToClient', (data) => {
        console.log('Received message from Websocket Server');
        obs.next(data);
      });
    });
    const observer = {
      next: (event: { event: string, data: object }) => {
        console.log('Send message to Websocket Server');
        this.socket.emit(event.event, event.data);
      },
    };
    return Subject.create(observer, observable);
  }

  subscribeToDeleteMessageEvent(): Observable<MessageEvent> {
    return new Observable(obs => {
      this.socket.on('deleteMessage', (data) => {
        obs.next(data);
      });
    });
  }

  subscribeToUserOnlineEvent(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('userOnline', (data) => {
        obs.next(data);
      });
    });
  }

  subscribeToUserOfflineEvent(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('userOffline', (data) => {
        obs.next(data);
      });
    });
  }
}
