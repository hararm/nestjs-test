import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from '../../../environments/environment';
import {Observable, Subject} from 'rxjs';
import Socket = SocketIOClient.Socket;


@Injectable()
export class WebsocketService {

  // Our socket connection
  private socket: Socket;

  constructor() { }

  connect(): Subject<MessageEvent> {
    // If you aren't familiar with environment variables then
    // you can hard code `environment.ws_url` as `http://localhost:9000`
    this.socket = io.connect(environment.ws_url, {autoConnect: true, rejectUnauthorized: true});

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    const observable = new Observable(obs => {
      this.socket.on('msgToClient', (data) => {
        console.log('Received message from Websocket Server');
        obs.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    const observer = {
      next: (event: {event: string, data: object}) => {
        console.log('Send message to Websocket Server');
         this.socket.emit(event.event, JSON.stringify(event.data));
      },
    };
    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Subject.create(observer, observable);
  }
}
