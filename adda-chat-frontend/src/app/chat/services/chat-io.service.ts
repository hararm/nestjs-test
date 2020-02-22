import {Injectable} from '@angular/core';
import {WebsocketService} from './websocket.service';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {ChatMessage} from '../../../../../shared/chat-message';
import * as io from 'socket.io-client';

@Injectable()
export class ChatIOService {

  messages: Subject<any>;

  constructor(private wsService: WebsocketService) {
    this.wsService.connect();
    this.messages = (wsService.subscribeToEvents().pipe(map((response: any): any => {
      return response;
    })) as Subject<any>)
  }

  sendMessage(msg: ChatMessage) {
    this.messages.next({event: 'msgToServer', data: msg});
  }

  joinRoom(channelId: string) {
    this.messages.next({event: 'joinRoom', data: channelId});
  }

  leaveRoom(channelId: string) {
    this.messages.next({event: 'leaveRoom', data: channelId});
  }

  getChannelMembers() {
  }
}
