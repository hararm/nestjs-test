import { Component, OnInit } from '@angular/core';
import {BsDropdownConfig} from 'ngx-bootstrap';

@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class ChatComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
