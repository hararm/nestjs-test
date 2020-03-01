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
import {switchMap} from 'rxjs/operators';
import {Account} from '../models/account.model';

@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BsDropdownConfig, useValue: {isAnimated: true, autoClose: true}}]
})

export class ChatComponent implements OnInit {
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

  config = {
    displayKey: 'description', // if objects array passed which key to be displayed defaults to description
    search: true, // true/false for the search functionlity defaults to false,
    height: 'auto', // height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Select', // text to be displayed when no item is selected defaults to Select,
    customComparator: () => {
    },// a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search', // label thats displayed in search input,
    searchOnKey: 'name', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: true // clears search criteria when an option is selected if set to true, default is false
  };

  dropdownOptions = [
    'All',
    'ASP Group Clinic1',
    'ASP Group Clinic2',
    'CBI Group Clinic1',
    'CBI Group Clinic2',
  ];
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
    this.chatIOService.connect(this.myUserId, this.myUserEmail);
    this.subscription.add(this.chatHttpService.findAllGroups().subscribe(groups => {
      const memberGroups: Group[] = [];
      this.chatGroups = groups;
      this.ref.markForCheck();
    }));
    this.subscription.add(this.chatHttpService.findAllUsers().subscribe(users => {
      this.chatUsers = users;
    }));

    this.subscription.add(this.chatIOService.inviteMember$.subscribe((data: { id: string, user: User }) => {
      if(data.user._id  === this.myUserId) {
        const group = this.chatGroups.find( g => g._id === data.id);
        if(group) {
          group.members.push(data.user._id);
          this.ref.markForCheck();
        }
      }
    }));

    this.subscription.add(this.chatIOService.unInviteMember$.subscribe((data: { id: string, user: User }) => {
      const group = this.chatGroups.find( g => g._id === data.id);
      if(group) {
        const index = group.members.findIndex(m => m === data.user._id);
        group.members.splice(index, 1);
        this.ref.markForCheck();
      }
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
        groups: this.chatGroups,
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

  onSelectByClinic() {
    if (this.dataModel === 'All') {
      this.subscription.add(this.chatHttpService.findAllGroups().subscribe(groups => {
        this.chatGroups = groups;
        this.ref.markForCheck();
      }));
    } else {
      this.subscription.add(this.chatHttpService.findGroupByClinicName(this.dataModel).subscribe(groups => {
        this.chatGroups = groups;
        this.ref.markForCheck();
      }));
    }
    this.dataModel = null;
  }

  clinicsDropDownSelectionChanged(event) {
    this.dataModel = event.value;
  }

  isMyGroup(group: Group) {
    for (const m of group.members) {
      if (m === this.myUserId) {
        return true;
      }
    }
    return false;
  }

  onLogOut() {
    this.chatIOService.disconnect();
    localStorage.removeItem('authJwtToken');
    this.router.navigateByUrl('/login').then();
  }

}
