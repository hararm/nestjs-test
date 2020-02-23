import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ChatIOService} from '../services/chat-io.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ChatHttpService} from '../services/chat-http.service';
import {ChatMessage} from '../../../../../shared/chat-message';
import * as moment from 'moment';
import {ChatUser} from '../../../../../shared/chat-user';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupChatComponent implements OnInit, OnDestroy {
  currentUserId: string;
  groupName: string;
  currentUserName: string;
  groupId: string;
  messages: ChatMessage[];
  users: ChatUser[];
  subscription: Subscription;
  msgForm = new FormGroup({
    message: new FormControl(''),
  });

  constructor(
    private ref: ChangeDetectorRef,
    private chatIOService: ChatIOService,
    private chatHttpService: ChatHttpService,
    private route: ActivatedRoute) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.messages = [];
    this.currentUserName = localStorage.getItem('email');
    this.currentUserId = localStorage.getItem('userId');
    this.route.params
      .subscribe(params => {
        console.log(params);
        this.groupId = params.groupId;
      });

    this.subscription.add(this.chatIOService.messages.subscribe((msg: any) => {
      if (msg.senderId) {
        console.log('New Message from server', msg);
        this.messages.push(msg);
        this.ref.markForCheck();
      } else {
        // System message
        this.users = msg as ChatUser[];
        this.ref.markForCheck();
        console.log('Active users from server', JSON.stringify(this.users));
      }
    }));
    if (this.groupId) {
      this.subscription.add(this.chatHttpService.findGroupById(this.groupId).subscribe(group => {
        this.groupName = group.groupName;
        this.ref.markForCheck();
      }));
    }
    this.chatIOService.joinRoom(new ChatUser(this.currentUserId, this.currentUserName, this.groupId));
  }

  onSendToGroup() {
    console.log('Message to server', this.msgForm.value);
    this.chatIOService.sendMessage(
      new ChatMessage(this.currentUserId,
        null,
        this.groupId,
        this.msgForm.get('message').value,
        moment().format('LLL'),
        this.currentUserName));
    this.msgForm.get('message').patchValue(null);
  }

  onLeftRoom() {
    this.chatIOService.leaveRoom(new ChatUser(this.currentUserId, this.currentUserName, this.groupId));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
