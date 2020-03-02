import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService} from '../auth.service';
import {tap} from 'rxjs/operators';
import {noop} from 'rxjs';
import {Router} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import {ChatIOService} from "../../chat/services/chat-io.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  private jwtHelper = new JwtHelperService();
  constructor(
    private chatIOService: ChatIOService,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router) {

    this.form = fb.group({
      email: ['armen@addatech.ca', [Validators.required]],
      password: ['password', [Validators.required]]
    });

  }

  ngOnInit() {

  }

  login() {
    const val = this.form.value;
    this.auth.login(val.email, val.password).subscribe( (reply: any) => {
      const decodedToken = this.jwtHelper.decodeToken(reply.authJwtToken);
      if(decodedToken) {
        localStorage.setItem('authJwtToken', reply.authJwtToken);
        localStorage.setItem('email', this.form.get('email').value);
        localStorage.setItem('userId', decodedToken.id);
        this.router.navigateByUrl('/chat').then();
        this.chatIOService.connect(decodedToken.id,  this.form.get('email').value);
      }
    }, err => {
      console.log('Login failed:', err);
    });
  }

}

