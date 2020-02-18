import { Component, OnInit } from '@angular/core';
import {BsDropdownConfig, BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FormBuilder} from '@angular/forms';
import {AddGroupComponent} from '../add-group/add-group.component';

@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})

export class ChatComponent implements OnInit {
  modalConfig = {
    animated: true,
    keyboard: false,
    backdrop: false,
    initialState: undefined,
    ignoreBackdropClick: true
  };

  constructor(private fb: FormBuilder, public modalFormRef: BsModalRef, private modalService: BsModalService,) {
  }

  ngOnInit() {
  }

  onAddGroup() {
    this.modalConfig.initialState = {
      data: {
      }
    };
    this.modalFormRef = this.modalService.show(AddGroupComponent, Object.assign({}, this.modalConfig));
  }

}
