import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ChatIOService} from '../services/chat-io.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ChatHttpService} from '../services/chat-http.service';
import {ChatMessage} from '../../../../../shared/chat-message';
import * as moment from 'moment';

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
        console.log(this.groupName);
      });

    this.subscription.add(this.chatIOService.messages.subscribe((msg: ChatMessage) => {
      console.log('Message from server', msg);
      if(msg.senderId) {
        this.messages.push(msg);
        this.ref.markForCheck();
      }
    }));
    if (this.groupId) {
      this.subscription.add(this.chatHttpService.findGroupById(this.groupId).subscribe(group => {
        this.groupName = group.groupName;
        this.ref.markForCheck();
      }));
    }

    this.chatIOService.joinRoom(this.groupId);
  }

  onSendToGroup() {
    console.log('Message to server', this.msgForm.value);
    this.chatIOService.sendMessage(
      new ChatMessage(this.currentUserId,
      this.groupId,
      this.msgForm.get('message').value,
      moment().format('LLL'),
      this.currentUserName));
  }

  onLeftRoom() {
    this.chatIOService.leaveRoom(this.groupId);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
