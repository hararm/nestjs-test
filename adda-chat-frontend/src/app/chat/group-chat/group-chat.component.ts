import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ChatIOService} from '../services/chat-io.service';
import {FormControl, FormGroup} from '@angular/forms';
import {combineLatest, EMPTY, Subscription} from 'rxjs';
import {ChatHttpService} from '../services/chat-http.service';
import * as moment from 'moment';
import {ChatMessage} from '../models/chat-message.model';
import {Account} from '../models/account.model';
import {User} from '../models/user.model';
import {Group} from '../models/group.model';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupChatComponent implements OnInit, OnDestroy {
  myUserId: string;
  myUserName: string;
  messages: ChatMessage[];
  publicGroups: Group[];
  privateGroups: Group[];
  activeGroup: Group;
  onlineMembers: Account[] = [];
  groupMembers: Account[] = [];
  groupChannelId: string;
  users: User[];
  subscription: Subscription;
  msgForm = new FormGroup({
    message: new FormControl(''),
  });

  chatTypes: { id: number, name: string }[] = [
    {id: 1, name: 'Public'}, {id: 2, name: 'Private'}
  ];

  constructor(
    private ref: ChangeDetectorRef,
    private chatIOService: ChatIOService,
    private chatHttpService: ChatHttpService,
    private router: Router,
    private route: ActivatedRoute) {
    this.messages = [];
    this.subscription = new Subscription();
    this.myUserName = localStorage.getItem('email');
    this.myUserId = localStorage.getItem('userId');
  }

  ngOnInit(): void {
    this.subscription.add(this.chatIOService.messages.subscribe((msg: any) => {
      if (msg.senderId) {
        console.log('New Message from server', msg);
        this.messages.push(msg);
        this.ref.markForCheck();
      }
    }));

    this.subscription.add(this.chatIOService.disconnectEvent$.subscribe(() => {
      console.log('Disconnected from server');
      this.router.navigate(['/login']).then();
    }));

    this.subscription.add(this.chatIOService.joinToRoomEvent$.subscribe((data) => {
      this.onlineMembers = data as Account[];
      this.updateUserStatus();
      this.sortGroupMembers();
      this.ref.markForCheck();
      console.log('Client joined room', JSON.stringify(data));
      console.log('Active users from server', JSON.stringify(this.groupMembers));
    }));

    this.subscription.add(this.chatIOService.userOnline$.pipe(switchMap(id => {
      return this.chatHttpService.findUser(id);
    })).subscribe(user => {
      this.onlineMembers.push(new Account(user.email, user.email, null, true, user._id));
      this.ref.markForCheck();
      this.ref.markForCheck();
    }));

    this.subscription.add(this.chatIOService.userOffline$.subscribe(userId => {
      const index = this.onlineMembers.findIndex(m => m === userId);
      this.onlineMembers.splice(index, 1);
      this.ref.markForCheck();
      this.ref.markForCheck();
    }));

    this.subscription.add(this.chatIOService.inviteMember$.subscribe((data: { id: string, user: User }) => {
      if (data.user._id === this.myUserId) {
        this.getPublicGroups();
      } else {
        this.groupMembers.push(new Account(data.user.email, data.user.email, this.activeGroup._id, false, data.user._id));
        this.activeGroup.members = this.groupMembers.map(m => m._id);
        this.ref.markForCheck();
      }
    }));

    this.subscription.add(this.chatIOService.unInviteMember$.subscribe((data: { id: string, user: User }) => {
      if (data.user._id === this.myUserId) {
        this.activeGroup = null;
        this.getPublicGroups();
      } else {
        const index = this.groupMembers.findIndex(m => m._id === data.user._id);
        this.groupMembers.splice(index, 1);
        this.activeGroup.members = this.groupMembers.map(m => m._id);
        this.ref.markForCheck();
      }
    }));

    this.subscription.add(this.chatIOService.leftRoomEvent$.subscribe((data) => {
      this.onlineMembers = data as Account[];
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
    this.getPublicGroups();
  }

  private getPublicGroups() {
    const groups$ = this.chatHttpService.findAllGroups();
    const users$ = this.chatHttpService.findAllUsers();

    this.subscription.add(combineLatest(groups$, users$)
      .subscribe(([groups, users]) => {
        this.users = users;
        this.publicGroups = this.findMyPublicGroups(groups);
        this.initGroupChat();
      }));
  }

  private initGroupChat() {
    if (!this.publicGroups || this.publicGroups.length === 0) {
      return;
    }
    if (!this.activeGroup || !this.activeGroup._id) {
      this.activeGroup = this.publicGroups[0];
    }
    this.groupMembers = [];
    const activeGroup$ = this.chatHttpService.findGroupById(this.activeGroup._id);
    const activeMembersGroup$ = this.chatHttpService.findMembersByGroupById(this.activeGroup._id);
    const activeGroupMessages$ = this.chatHttpService.findMessagesGroupById(this.activeGroup._id);
    this.subscription.add(combineLatest(activeGroup$, activeMembersGroup$, activeGroupMessages$)
      .subscribe(([group, members, messages]) => {
          this.activeGroup = group;
          this.activeGroup.groupName = group.groupName;
          // convert to accounts
          for (const u of members) {
            const member = new Account(u.email, u.email, this.activeGroup._id, true, u._id);
            this.groupMembers.push(member);
          }
          this.messages = [...messages];
          this.updateUserStatus();
          this.sortGroupMembers();
          this.chatIOService.joinRoom(new Account(this.myUserName, this.myUserName, this.activeGroup._id, true, this.myUserId));
          this.ref.markForCheck();
        }
      ));
  }

  onCreateJoinPrivateGroup(user: User) {
    if (this.activeGroup) {
      this.leaveRoom();
    }
    const groupName = user.email + '-' + this.myUserName;
    const reverseGroupName = this.myUserName + '-' + user.email;
    this.subscription.add(this.chatHttpService.findGroupByName(groupName).pipe(switchMap(exGroup => {
        if (exGroup) {
          this.activeGroup = exGroup;
          this.initGroupChat();
          this.ref.markForCheck();
          return EMPTY;
        }
        return this.chatHttpService.findGroupByName(reverseGroupName);
      })
    ).pipe(switchMap(exGroup => {
      if (exGroup) {
        this.activeGroup = exGroup;
        this.initGroupChat();
        this.ref.markForCheck();
        return EMPTY;
      }

      const group = new Group();
      group.isPrivate = true;
      group.groupName = groupName;
      group.members = [];
      group.members.push(user._id);
      group.members.push(this.myUserId);
      return this.chatHttpService.addGroup(group);
    })).subscribe((gr) => {
      this.activeGroup = gr;
      this.initGroupChat();
      this.ref.markForCheck();
    }));
  }

  private findMyPublicGroups(groups: Group[]) {
    const myGroups: Group[] = [];
    for (const g of groups) {
      for (const m of g.members) {
        if (m === this.myUserId && !g.isPrivate) {
          myGroups.push(g);
        }
      }
    }
    return myGroups;
  }

  private updateUserStatus() {
    if (this.onlineMembers && this.onlineMembers.length > 0) {
      if (this.groupMembers && this.groupMembers.length > 0) {
        this.groupMembers.forEach(u => u.isOnline = false);
        this.groupMembers = this.groupMembers.map(user => {
          const user2 = this.onlineMembers.find(u => u._id === user._id && u.channelId === user.channelId);
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

  getMemberName(member: Account) {
    return member.email === this.myUserName ? this.myUserName + ' (Me)' : member.email;
  }

  onSendToGroup() {
    this.chatIOService.sendMessage(
      new ChatMessage(
        this.activeGroup._id,
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

  isCurrentlyActiveGroup(group: Group): boolean {
    if(!group) {
      return false;
    }
    return group?._id === this.activeGroup?._id
  }

  isCurrentlyActiveUser(user: User): boolean {
    if(this.activeGroup && this.activeGroup.isPrivate) {
      if(this.activeGroup.members.length && this.activeGroup.members.length === 2) {
        const groupName = user.email + '-' + this.myUserName;
        const reverseGroupName = this.myUserName + '-' + user.email;
        return this.activeGroup.groupName === groupName || this.activeGroup.groupName === reverseGroupName;
      }
      return false;
    }
    return false;
  }

  leaveRoom() {
    delete this.onlineMembers;
    this.onlineMembers = [];
    this.chatIOService.leaveRoom(new Account(this.myUserName, this.myUserName, this.activeGroup._id, false));
  }

  onAddGroupMember(user: User) {
    this.chatIOService.inviteMember(this.activeGroup._id, new User(user._id, user.email));
  }

  onRemoveGroupMember(member: Account) {
    this.chatIOService.unInviteMember(this.activeGroup._id, new User(member._id, member.email));
  }

  onDeleteMessage(message: ChatMessage) {
    console.log('Delete message', message);
    this.chatIOService.deleteMessage(message);
  }

  isUserOnline(user: User): boolean {
    const member = this.onlineMembers.find(m => m._id === user._id);
    if (member) {
      return member.isOnline;
    }
  }

  onJoinPublicGroup(group: Group) {
    if (this.activeGroup) {
      this.leaveRoom();
    }
    this.activeGroup = group;
    this.initGroupChat();
    this.ref.markForCheck();
  }

  isMyGroup(group: Group) {
    for (const m of group.members) {
      if (m === this.myUserId) {
        return true;
      }
    }
    return false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
