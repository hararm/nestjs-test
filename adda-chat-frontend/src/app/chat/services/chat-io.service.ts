import {Injectable, OnDestroy} from '@angular/core';
import {WebsocketService} from './websocket.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {IChatMessage} from '../../../../../shared/chat-message';
import * as io from 'socket.io-client';
import {Account} from '../models/account.model';
import {User} from '../models/user.model';

@Injectable()
export class ChatIOService {

  messages: Subject<any>;
  disconnectEvent$: Observable<any>;
  joinToRoomEvent$: Observable<any>;
  leftRoomEvent$: Observable<any>;
  inviteMember$: Observable<any>;
  unInviteMember$: Observable<any>;
  deleteMessage$: Observable<any>;
  userOnline$: Observable<any>;
  userOffline$: Observable<any>;

  constructor(private wsService: WebsocketService) {
    this.disconnectEvent$ = wsService.subscribeToDisconnectEvent();
    this.joinToRoomEvent$ = wsService.subscribeToJoinedToRoomEvent();
    this.leftRoomEvent$ = wsService.subscribeToLeftRoomEvent();
    this.inviteMember$ = wsService.subscribeToInviteMember();
    this.unInviteMember$ = wsService.subscribeToUnInviteMember();
    this.deleteMessage$ = wsService.subscribeToDeleteMessageEvent();
    this.userOnline$ = wsService.subscribeToUserOnlineEvent();
    this.userOffline$ = wsService.subscribeToUserOfflineEvent();
  }

  connect(userId: string, userLogin: string) {
    this.wsService.connect(userId, userLogin);
    this.messages = (this.wsService.subscribeToClientMessagesEvents().pipe(map((response: any): any => {
      return response;
    })) as Subject<any>);
  }
  disconnect() {
    this.wsService.disconnect();
  }

  sendMessage(msg: IChatMessage) {
    this.messages.next({event: 'msgToServer', data: msg});
  }

  deleteMessage(msg: IChatMessage) {
    this.messages.next({event: 'deleteMessage', data: msg});
  }

  joinRoom(groupMember: Account) {
    this.messages.next({event: 'joinRoom', data: groupMember});
  }

  leaveRoom(groupMember: Account) {
    this.messages.next({event: 'leaveRoom', data: groupMember});
  }

  inviteMember(id: string, user: User) {
    this.messages.next({event: 'inviteMember', data: {id, user}});
  }

  unInviteMember(id: string, user: User) {
    this.messages.next({event: 'unInviteMember', data: {id, user}});
  }
}
