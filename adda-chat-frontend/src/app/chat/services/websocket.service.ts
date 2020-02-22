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

  subscribeToEvents(): Subject<MessageEvent> {
    const observable = new Observable(obs => {
      this.socket.on('msgToClient', (data) => {
        console.log('Received message from Websocket Server');
        obs.next(data);
      });
      this.socket.on('joinedRoom', (data) => {
        console.log('Client joined room', data);
        obs.next(data);
      });
      this.socket.on('leftRoom', (data) => {
        console.log('Client left room', data);
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
