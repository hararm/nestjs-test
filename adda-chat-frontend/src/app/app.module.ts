import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthModule} from './auth/auth.module';
import {WebsocketService} from './chat/services/websocket.service';
import {ChatIOService} from './chat/services/chat-io.service';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)
  },
  {
    path: '**',
    redirectTo: 'chat'
  }
];
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    AuthModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    WebsocketService,
    ChatIOService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
