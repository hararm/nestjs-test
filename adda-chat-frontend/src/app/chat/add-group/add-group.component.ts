import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import {Group} from '../../../../../rest-api/src/chat/models/group.model';

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

  constructor(public modalFormRef: BsModalRef, private fb: FormBuilder,) {
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
      image: [null],
    });
  }

  fillForm() {
    this.addGroupForm.patchValue({
      name: this.group.name,
      image: this.group.image,
    });
  }

  submitClick() {
    this.modalFormRef.hide();
  }

  hideModal() {
    this.modalFormRef.hide();
  }

}
