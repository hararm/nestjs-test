import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class ChatIOService {

  messages: Subject<any>;

  // Our constructor calls our wsService connect method
  constructor(private wsService: WebsocketService) {
    this.messages = (wsService.connect().pipe(map((response: any): any => {
        return response;
      })) as Subject<any>)
  }

  // Our simplified interface for sending
  // messages back to our socket.io server
  sendMessage(msg) {
    this.messages.next(msg);
  }
}
