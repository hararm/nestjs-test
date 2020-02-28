import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ChatIOService} from '../services/chat-io.service';
import {FormControl, FormGroup} from '@angular/forms';
import {combineLatest, Subscription} from 'rxjs';
import {ChatHttpService} from '../services/chat-http.service';
import * as moment from 'moment';
import {ChatMessage} from '../models/chat-message.model';
import {GroupMember} from '../models/member.model';
import {User} from '../models/user.model';
import {Group} from '../models/group.model';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupChatComponent implements OnInit, OnDestroy {
  myUserId: string;
  myUserName: string;
  activeGroupName: string;
  activeGroupId: string;
  messages: ChatMessage[];
  activeGroup: Group;
  onlineGroupMembers: GroupMember[];
  groupMembers: GroupMember[] = [];
  users: User[];
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
    this.myUserName = localStorage.getItem('email');
    this.myUserId = localStorage.getItem('userId');
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
      this.onlineGroupMembers = data as GroupMember[];
      this.updateUserStatus();
      this.sortGroupMembers();
      this.ref.markForCheck();
      console.log('Client joined room', JSON.stringify(data));
      console.log('Active users from server', JSON.stringify(this.groupMembers));
    }));

    this.subscription.add(this.chatIOService.inviteMember$.subscribe((data: { id: string, user: User }) => {
      this.groupMembers.push(new GroupMember(data.user.email, data.user.email, this.activeGroupId, false, data.user._id));
      this.activeGroup.members = this.groupMembers;
      this.chatHttpService.updateGroup(this.activeGroupId, this.activeGroup).subscribe(group => {
        this.ref.markForCheck();
      });
    }));

    this.subscription.add(this.chatIOService.unInviteMember$.subscribe((data: { id: string, user: User }) => {
      const index = this.groupMembers.findIndex(m => m._id === data.user._id);
      this.groupMembers.splice(index, 1);
      this.activeGroup.members = this.groupMembers;
      this.chatHttpService.updateGroup(this.activeGroupId, this.activeGroup).subscribe(group => {
        this.ref.markForCheck();
      });
    }));

    this.subscription.add(this.chatIOService.leftRoomEvent$.subscribe((data) => {
      this.onlineGroupMembers = data as GroupMember[];
      this.updateUserStatus();
      this.ref.markForCheck();
      console.log('Client left room', JSON.stringify(data));
      console.log('Active users from server', JSON.stringify(this.groupMembers));
    }));

    this.subscription.add(this.chatIOService.deleteMessage$.subscribe((message: ChatMessage) => {
      console.log(`Delete message ${message}`);
      const index = this.messages.findIndex(m => m._id === message._id);
      this.messages.splice(index, 1);
      this.ref.markForCheck();
    }));

    if (this.activeGroupId) {
      const users$ = this.chatHttpService.findAllUsers();
      const activeGroup$ = this.chatHttpService.findGroupById(this.activeGroupId);
      const activeMembersGroup$ = this.chatHttpService.findMembersByGroupById(this.activeGroupId);
      const activeGroupMessages$ = this.chatHttpService.findMessagesGroupById(this.activeGroupId);
      this.subscription.add(combineLatest(users$, activeGroup$, activeMembersGroup$, activeGroupMessages$).subscribe(
        ([users, group, members, messages]) => {
          this.users = users;
          this.activeGroup = group;
          this.activeGroupName = group.groupName;
          this.groupMembers = [...members];
          this.messages = [...messages];
          this.updateUserStatus();
          this.sortGroupMembers();
          this.ref.markForCheck();
        }
      ));
    }
    this.chatIOService.joinRoom(new GroupMember(this.myUserName, this.myUserName, this.activeGroupId, true));
  }

  private updateUserStatus() {
    if(this.onlineGroupMembers && this.onlineGroupMembers.length > 0) {
      if (this.groupMembers && this.groupMembers.length > 0) {
        this.groupMembers.forEach(u => u.isOnline = false);
        this.groupMembers = this.groupMembers.map(user => {
          const user2 = this.onlineGroupMembers.find(u => u._id === user._id);
          return user2 ? {...user, isOnline: user2.isOnline} : user;
        });
      }
    }
  }

  private sortGroupMembers() {
    this.groupMembers.sort((m1, m2) => {
      return (m1.isOnline === m2.isOnline) ? 0 : m1.isOnline ? -1 : 1;
    });
  }

  getMemberName(member: GroupMember) {
    return member.email === this.myUserName ? this.myUserName + ' (Me)' : member.email;
  }

  onSendToGroup() {
    this.chatIOService.sendMessage(
      new ChatMessage(
        this.activeGroupId,
        this.myUserId,
        this.msgForm.get('message').value,
        null,
        this.myUserName,
        moment().format('LLL')
      ));
    console.log('Message to server', this.msgForm.value);
    this.msgForm.get('message').patchValue(null);
  }

  isMemberOfCurrentGroup(user: User) {
    if (!this.groupMembers || this.groupMembers.length === 0) {
      return undefined;
    }
    return this.groupMembers.find(u => u._id === user._id);
  }

  isMyUser(id: string): boolean {
    return id === this.myUserId;
  }

  onLeftRoom() {
    delete this.onlineGroupMembers;
    this.chatIOService.leaveRoom(new GroupMember(this.myUserName, this.myUserName, this.activeGroupId, false));
  }

  onAddGroupMember(user: User) {
    this.chatIOService.inviteMember(this.activeGroupId, new User(user._id, user.email));
  }

  onRemoveGroupMember(member: GroupMember) {
    this.chatIOService.unInviteMember(this.activeGroupId, new User(member._id, member.email));
  }

  onDeleteMessage(message: ChatMessage) {
    console.log('Delete message', message);
    this.chatIOService.deleteMessage(message);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
