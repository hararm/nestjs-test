import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ChatIOService} from '../services/chat-io.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ChatHttpService} from '../services/chat-http.service';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupChatComponent implements OnInit, OnDestroy {

  groupName: string;
  groupId: string;
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
    this.route.params
      .subscribe(params => {
        console.log(params);
        this.groupId = params.groupId;
        console.log(this.groupName);
      });

    this.subscription.add(this.chatIOService.messages.subscribe(msg => {
      console.log('Message from server', msg);
    }));
    if (this.groupId) {
      this.subscription.add(this.chatHttpService.findGroupById(this.groupId).subscribe(group => {
        this.groupName = group.groupName;
        this.ref.markForCheck();
      }));
    }

    this.chatIOService.joinRoom(this.groupId, 'Armen');
  }

  onSendToGroup() {
    console.log('Message to server', this.msgForm.value);
    this.chatIOService.sendMessage(this.msgForm.get('message').value, this.groupId, 'Armen');
  }

  onLeftRoom() {
    this.chatIOService.leaveRoom(this.groupId, 'Armen');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
