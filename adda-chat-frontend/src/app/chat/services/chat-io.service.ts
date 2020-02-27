import {Injectable, OnDestroy} from '@angular/core';
import {WebsocketService} from './websocket.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {IChatMessage} from '../../../../../shared/chat-message';
import * as io from 'socket.io-client';
import {GroupMember} from '../models/member.model';
import {User} from "../models/user.model";

@Injectable()
export class ChatIOService {

  messages: Subject<any>;
  disconnectEvent$: Observable<any>;
  joinToRoomEvent$: Observable<any>;
  leftRoomEvent$: Observable<any>;
  inviteMember$: Observable<any>;
  unInviteMember$: Observable<any>;

  constructor(private wsService: WebsocketService) {
    this.wsService.connect();
    this.messages = (wsService.subscribeToClientMessagesEvents().pipe(map((response: any): any => {
      return response;
    })) as Subject<any>);

    this.disconnectEvent$ = wsService.subscribeToDisconnectEvent();
    this.joinToRoomEvent$ = wsService.joinedToRoomEvent();
    this.leftRoomEvent$ = wsService.leftRoomEvent();
    this.inviteMember$ = wsService.inviteMember();
    this.unInviteMember$ = wsService.unInviteMember();
  }

  sendMessage(msg: IChatMessage) {
    this.messages.next({event: 'msgToServer', data: msg});
  }

  joinRoom(groupMember: GroupMember) {
    this.messages.next({event: 'joinRoom', data: groupMember});
  }

  leaveRoom(groupMember: GroupMember) {
    this.messages.next({event: 'leaveRoom', data: groupMember});
  }

  inviteMember(id: string, user: User) {
    this.messages.next({event: 'inviteMember', data: { id, user}});
  }

  unInviteMember(id: string, user: User) {
    this.messages.next({event: 'unInviteMember', data: { id, user}});
  }
}
