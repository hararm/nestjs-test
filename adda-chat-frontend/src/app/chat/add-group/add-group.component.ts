import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import {ChatHttpService} from '../services/chat-http.service';
import {Group} from '../models/group.model';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddGroupComponent implements OnInit {
  addGroupForm: FormGroup;
  group: Group;
  isNew: boolean;
  file: any;

  constructor(public modalFormRef: BsModalRef, private fb: FormBuilder, private chatHttpService: ChatHttpService) {
    if(!this.isNew) {
      this.group = new Group();
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.fillForm();
  }

  initForm() {
    this.addGroupForm = this.fb.group({
      groupName: [null, Validators.required],
      clinicName: [null],
    });
  }

  fillForm() {
    this.addGroupForm.patchValue({
      groupName: this.group.groupName,
      clinicName: this.group.clinicName
    });
  }

  fileChanged(e) {
    this.file = e.target.files[0];
  }

  submitClick() {
    const res = this.addGroupForm.controls;
    this.chatHttpService.addGroup(this.addGroupForm.value).subscribe( () => {
      this.modalFormRef.hide();
    });
  }

  hideModal() {
    this.modalFormRef.hide();
  }

}
