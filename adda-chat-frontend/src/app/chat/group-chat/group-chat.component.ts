import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ChatIOService} from '../services/chat-io.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ChatHttpService} from '../services/chat-http.service';
import * as moment from 'moment';
import {ChatMessage} from '../models/chat-message.model';
import {GroupMember} from '../models/member.model';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupChatComponent implements OnInit, OnDestroy {
  currentUserId: string;
  activeGroupName: string;
  currentUserName: string;
  activeGroupId: string;
  messages: ChatMessage[];
  onlineGroupUsers: GroupMember[];
  groupUsers: GroupMember[];
  subscription: Subscription;
  msgForm = new FormGroup({
    message: new FormControl(''),
  });

  constructor(
    private ref: ChangeDetectorRef,
    private chatIOService: ChatIOService,
    private chatHttpService: ChatHttpService,
    private router: Router,
    private route: ActivatedRoute) {
    this.messages = [];
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.currentUserName = localStorage.getItem('email');
    this.currentUserId = localStorage.getItem('userId');
    this.route.params
      .subscribe(params => {
        console.log(params);
        this.activeGroupId = params.groupId;
      });

    this.subscription.add(this.chatIOService.messages.subscribe((msg: any) => {
      if (msg.senderId) {
        console.log('New Message from server', msg);
        this.messages.push(msg);
        this.ref.markForCheck();
      }
    }));

    this.subscription.add(this.chatIOService.disconnectEvent$.subscribe(() => {
      console.log('Disconnected from server');
      this.router.navigate(['/chat']).then();
    }));

    this.subscription.add(this.chatIOService.joinToRoomEvent$.subscribe((data) => {
      this.onlineGroupUsers = data as GroupMember[];
      this.updateUserStatus();
      this.ref.markForCheck();
      console.log('Client joined room', JSON.stringify(data));
      console.log('Active users from server', JSON.stringify(this.groupUsers));
    }));

    this.subscription.add(this.chatIOService.leftRoomEvent$.subscribe((data) => {
      this.onlineGroupUsers = data as GroupMember[];
      this.updateUserStatus();
      this.ref.markForCheck();
      console.log('Client left room', JSON.stringify(data));
      console.log('Active users from server', JSON.stringify(this.groupUsers));
    }));
    if (this.activeGroupId) {
      this.subscription.add(this.chatHttpService.findGroupById(this.activeGroupId).subscribe(group => {
        this.activeGroupName = group.groupName;
        this.ref.markForCheck();
      }));
      this.subscription.add(this.chatHttpService.findMessagesGroupById(this.activeGroupId).subscribe(messages => {
        console.log('Saved Messages', JSON.stringify(messages));
        this.messages = [...messages];
        this.ref.markForCheck();
      }));

      this.subscription.add(this.chatHttpService.findUsersByGroupById(this.activeGroupId).subscribe(users => {
        console.log('Group Users', JSON.stringify(users));
        this.groupUsers = [...users];
        this.groupUsers = this.groupUsers.map(user => {
          const user2 = this.onlineGroupUsers.find(u => u.userName === user.userName);
          return user2 ? {...user, ...user2} : user;
        });
        this.ref.markForCheck();
      }));
    }
    this.chatIOService.joinRoom(new GroupMember(this.currentUserName, this.currentUserName, this.activeGroupId, true));
  }

  private updateUserStatus() {
    if (this.groupUsers && this.groupUsers.length > 0) {
      this.groupUsers.forEach(u => u.isOnline = false);
      this.groupUsers = this.groupUsers.map(user => {
        const user2 = this.onlineGroupUsers.find(u => u.userName === user.userName);
        return user2 ? {...user, ...user2} : user;
      });
    }
  }
  getMemberName(member: GroupMember) {
    return member.email === this.currentUserName ? this.currentUserName + ' (Me)' : member.email;
  }

  onSendToGroup() {
    this.chatIOService.sendMessage(
      new ChatMessage(
        this.activeGroupId,
        this.currentUserId,
        this.msgForm.get('message').value,
        null,
        this.currentUserName,
        moment().format('LLL')
      ));
    console.log('Message to server', this.msgForm.value);
    this.msgForm.get('message').patchValue(null);
  }

  onLeftRoom() {
    delete this.onlineGroupUsers;
    this.chatIOService.leaveRoom(new GroupMember(this.currentUserName, this.currentUserName, this.activeGroupId, false));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
