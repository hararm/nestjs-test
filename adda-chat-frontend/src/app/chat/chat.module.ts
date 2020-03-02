import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from './chat-component/chat.component';
import {NgModule} from '@angular/core';
import {AppBootstrapModule} from '../bootsrap.module';
import {AddGroupComponent} from './add-group/add-group.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChatHttpService} from './services/chat-http.service';
import {CommonModule} from '@angular/common';
import {SelectDropDownModule} from 'ngx-select-dropdown';
import {GroupChatComponent} from './group-chat/group-chat.component';
import {ChatIOService} from './services/chat-io.service';
import {WebsocketService} from './services/websocket.service';
import { EditGroupMemberComponent } from './add-group-member/edit-group-member.component';
import {DxModule} from '../dx.module';

export const chatRoutes: Routes = [
  {
    path: '',
    component: GroupChatComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    AppBootstrapModule,
    DxModule,
    RouterModule.forChild(chatRoutes),
    FormsModule,
    ReactiveFormsModule,
    SelectDropDownModule
  ],
  declarations: [
    ChatComponent,
    AddGroupComponent,
    GroupChatComponent,
    EditGroupMemberComponent
  ],
  exports: [
    ChatComponent
  ],
  providers: [
    ChatHttpService,
    WebsocketService,
    ChatIOService
  ],
  entryComponents: [
    AddGroupComponent,
    EditGroupMemberComponent
  ]
})
export class ChatModule {
}
