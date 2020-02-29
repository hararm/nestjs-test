import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import {Group} from '../../../../../rest-api/src/chat/models/group.model';
import {ChatHttpService} from '../services/chat-http.service';

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
      name: [null, Validators.required],
      clinicName: [null],
      image: [''],
    });
  }

  fillForm() {
    this.addGroupForm.patchValue({
      name: this.group.groupName,
      clinicName: this.group.clinicName
    });
  }

  fileChanged(e) {
    this.file = e.target.files[0];
  }

  submitClick() {
    const res = this.addGroupForm.controls;
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('name', res.name.value);
    formData.append('clinicName', res.clinicName.value);
    this.chatHttpService.addGroup(formData).subscribe( () => {
      this.modalFormRef.hide();
    });
  }

  hideModal() {
    this.modalFormRef.hide();
  }

}
