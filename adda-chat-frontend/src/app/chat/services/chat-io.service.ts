import {Injectable} from '@angular/core';
import {WebsocketService} from './websocket.service';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class ChatIOService {

  messages: Subject<any>;

  constructor(private wsService: WebsocketService) {
    this.wsService.connect();
    this.messages = (wsService.subscribeToEvents().pipe(map((response: any): any => {
      return response;
    })) as Subject<any>)
  }

  sendMessage(msg: string, groupId: string, sender: string) {
    this.messages.next({event: 'msgToServer', data: {sender, room: groupId, message: msg}});
  }

  joinRoom(groupId: string, sender: string) {
    this.messages.next({event: 'joinRoom', data: groupId});
  }

  leaveRoom(groupId: string, sender: string) {
    this.messages.next({event: 'leaveRoom', data: groupId});
  }
}
