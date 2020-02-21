import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    BsModalRef,
  ],
  exports: [BsDropdownModule, TooltipModule, ModalModule]
})
export class AppBootstrapModule {}
