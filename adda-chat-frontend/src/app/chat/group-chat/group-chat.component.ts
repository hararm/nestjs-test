import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ChatIOService} from '../services/chat-io.service';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css']
})
export class GroupChatComponent implements OnInit {

  groupName: string;
  msgForm = new FormGroup({
    message: new FormControl(''),
  });
  constructor(private chatIOService: ChatIOService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        console.log(params);
        this.groupName = params['groupName'];
        console.log(this.groupName);
      });

    this.chatIOService.messages.subscribe(msg => {
      console.log(msg);
    })
  }


  onSendToGroup() {
    console.log(this.msgForm.value);
    this.chatIOService.sendMessage(this.msgForm.get('message').value);
  }
}
