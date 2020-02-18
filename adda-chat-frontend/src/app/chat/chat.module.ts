import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from './chat-component/chat.component';
import {NgModule} from '@angular/core';
import {AppBootstrapModule} from '../bootsrap.module';
import {AddGroupComponent} from './add-group/add-group.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChatHttpService} from './services/chat-http.service';

export const chatRoutes: Routes = [
  {
    path: '',
    component: ChatComponent
  }
];

@NgModule({
  imports: [AppBootstrapModule, RouterModule.forChild(chatRoutes), FormsModule, ReactiveFormsModule],
  declarations: [
    ChatComponent,
    AddGroupComponent
  ],
  exports: [
    ChatComponent
  ],
  providers: [
    ChatHttpService,
  ],
  entryComponents: [
    AddGroupComponent
  ]
})
export class ChatModule {
}
