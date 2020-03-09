import {Component, OnInit} from '@angular/core';
import {SignUpUser} from '../models/user.model';
import {BsModalRef} from 'ngx-bootstrap';
import {ChatHttpService} from '../services/chat-http.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  addUserForm: FormGroup;
  user: SignUpUser;
  roles: FormArray;
  isNew: boolean;
  roleNames = ['ADMIN', 'PRACTITIONER'];

  constructor(public modalFormRef: BsModalRef, private fb: FormBuilder, private chatHttpService: ChatHttpService) {
    if (!this.isNew) {
      this.user = new SignUpUser('', '', '');
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
      password: [null],
      roles: this.fb.array(([this.createRole()]))
    });
  }

  createRole(): FormGroup {
    return this.fb.group({
     role: this.roleNames[0]
    });
  }

  addRole(): void {
    this.roles = this.addUserForm.controls.roles as FormArray;
    this.roles.push(this.createRole());
  }

  fillForm() {
    this.addUserForm.patchValue({
      email: this.user.email,
      userName: this.user.userName,
      roles: this.user.roles || []
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
