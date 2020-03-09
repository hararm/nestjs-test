import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from "../models/user.model";
import {BsModalRef} from "ngx-bootstrap";
import {ChatHttpService} from "../services/chat-http.service";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  addUserForm: FormGroup;
  user: User;
  roles: FormArray;
  isNew: boolean;

  constructor(public modalFormRef: BsModalRef, private fb: FormBuilder, private chatHttpService: ChatHttpService) {
    if (!this.isNew) {
      this.user = new User('', '', '');
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.fillForm();
  }

  initForm() {
    this.addUserForm = this.fb.group({
      email: [null, Validators.required],
      userName: [null],
      roles: this.fb.array(([this.createRole()]))
    });
  }

  createRole(): FormGroup {
    return this.fb.group({
     role: 'PRACTITIONER'
    });
  }

  addRole(): void {
    this.roles = this.addUserForm.get('roles') as FormArray;
    this.roles.push(this.createRole());
  }

  fillForm() {
    this.addUserForm.patchValue({
      email: this.user.email,
      userName: this.user.userName,
    });
  }

  hideModal() {
    this.modalFormRef.hide();
  }

  submitClick() {
    const res = this.addUserForm.controls;
    this.chatHttpService.signUpUser(this.addUserForm.value).subscribe( () => {
      this.modalFormRef.hide();
    });
  }

  AddRole() {
    this.addRole();
  }

}
