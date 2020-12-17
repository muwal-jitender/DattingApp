import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }
  login = () => {
    this.accountService.login(this.model).subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error);
    });
  }

  logout = () => {
    this.accountService.logout();
  }

  getCurrentUser = () => {
    this.accountService.currentUser$.subscribe(user => {
      // !! means if user is null then set false else set true
    }, error => {
      console.log(error);
    });
  }
}
