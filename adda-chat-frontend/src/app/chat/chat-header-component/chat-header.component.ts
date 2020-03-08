import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BsDropdownConfig, BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FormBuilder} from '@angular/forms';
import {AddGroupComponent} from '../add-group/add-group.component';
import {Group} from '../models/group.model';
import {Subscription} from 'rxjs';
import {ChatHttpService} from '../services/chat-http.service';
import {ChatIOService} from '../services/chat-io.service';
import {Router} from '@angular/router';
import {EditGroupMemberComponent} from '../add-group-member/edit-group-member.component';
import {User} from '../models/user.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-chat-header-component',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BsDropdownConfig, useValue: {isAnimated: true, autoClose: true}}]
})

export class ChatHeaderComponent implements OnInit {
  modalConfig = {
    animated: true,
    keyboard: false,
    backdrop: false,
    initialState: undefined,
    ignoreBackdropClick: true
  };

  chatGroups: Group[];
  chatUsers: User[];
  subscription: Subscription;

  myUserEmail: string;
  dataModel: string = null;
  myUserId: string;

  constructor(private fb: FormBuilder,
              private router: Router,
              public modalFormRef: BsModalRef,
              private ref: ChangeDetectorRef,
              private chatHttpService: ChatHttpService,
              private modalService: BsModalService,
              private chatIOService: ChatIOService,
  ) {
    this.subscription = new Subscription();
    this.myUserEmail = localStorage.getItem('email');
    this.myUserId = localStorage.getItem('userId');
  }

  ngOnInit() {
    this.subscription.add(this.chatHttpService.findAllPublicGroups().subscribe(groups => {
      this.chatGroups = groups;
      this.ref.markForCheck();
    }));
    this.subscription.add(this.chatHttpService.findAllUsers().subscribe(users => {
      this.chatUsers = users;
    }));
  }

  onAddGroup() {
    this.modalConfig.initialState = {
      data: {}
    };
    this.modalFormRef = this.modalService.show(AddGroupComponent, Object.assign({}, this.modalConfig));
  }

  onEditGroupMembers() {
    this.modalConfig.initialState = {
      data: {
        groups: _.cloneDeep(this.chatGroups),
        users: this.chatUsers
      }
    };
    this.modalFormRef = this.modalService.show(EditGroupMemberComponent, Object.assign({}, this.modalConfig));
    this.modalFormRef.content.onClose.subscribe((result: Group) => {
      this.chatHttpService.updateGroup(result._id, result).subscribe();
      this.ref.markForCheck();
      console.log('results', result);
    })
  }

  onLogOut() {
    this.chatIOService.disconnect();
    localStorage.removeItem('authJwtToken');
    this.router.navigateByUrl('/login').then();
  }

}
