import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {ChatHttpService} from '../services/chat-http.service';
import {Group} from '../models/group.model';
import {User} from '../models/user.model';
import {Subject, Subscription} from 'rxjs';
import * as _ from 'lodash';


@Component({
  selector: 'app-edit-group-member',
  templateUrl: './edit-group-member.component.html',
  styleUrls: ['./edit-group-member.component.css'],
})
export class EditGroupMemberComponent implements OnInit {
  public onClose: Subject<Group>;
  config1 = {
    displayKey: 'groupName', // if objects array passed which key to be displayed defaults to description
    search: true, // true/false for the search functionlity defaults to false,
    height: 'auto', // height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Select Group', // text to be displayed when no item is selected defaults to Select,
    customComparator: () => {
    },// a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search', // label thats displayed in search input,
    searchOnKey: 'groupName', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: true // clears search criteria when an option is selected if set to true, default is false
  };
  selectedGroup: Group;
  subscription: Subscription;

  data: {
    groups: Group[],
    users: User[]
  };

  groupUsers: User[] = [];
  diffusers: User[];
  constructor( private ref: ChangeDetectorRef,
               public modalFormRef: BsModalRef,
              private chatHttpService: ChatHttpService) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.onClose = new Subject();
    this.diffusers = this.groupUsers;
  }

  hideModal() {
    this.modalFormRef.hide();
  }

  submitClick() {
    if(this.selectedGroup) {
      this.selectedGroup.members = this.groupUsers;
      this.onClose.next(this.selectedGroup);
      this.hideModal();
    }
  }

  groupsDropDownSelectionChanged(event) {
    this.selectedGroup = event.value;
    this.subscription.add(this.chatHttpService.findMembersByGroupById(this.selectedGroup._id).subscribe(users => {
      this.groupUsers = users;
      this.diffusers = _.differenceBy(this.data.users, users, '_id');
      this.ref.markForCheck();
    }))
  }

  onDragStart(e) {
    e.itemData = e.fromData[e.fromIndex];
  }

  onAdd(e) {
    e.toData.splice(e.toIndex, 0, e.itemData);
  }

  onRemove(e) {
    e.fromData.splice(e.fromIndex, 1);
  }
}
