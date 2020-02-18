import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from './chat-component/chat.component';
import {NgModule} from '@angular/core';
import {AppBootstrapModule} from '../bootsrap.module';

export const chatRoutes: Routes = [
  {
    path: '',
    component: ChatComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(chatRoutes)],
  declarations: [
    ChatComponent
  ],
  exports: [
    ChatComponent
  ]
})
export class ChatModule {
}
