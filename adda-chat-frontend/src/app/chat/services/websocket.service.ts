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

  connect() {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
    }
    this.socket = io(environment.ws_url, {autoConnect: true, rejectUnauthorized: true});
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

  joinedToRoomEvent(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('joinedRoom', (data) => {
        obs.next(data);
      });
    });
  }

  leftRoomEvent(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('leftRoom', (data) => {
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
}
