import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {

  }

  ngOnInit(): void {
    this.router.navigateByUrl('/chat').then();
  }
}
