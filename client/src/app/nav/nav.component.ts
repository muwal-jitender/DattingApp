import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }
  login = () => {
    this.accountService.login(this.model).subscribe(res => {
      this.router.navigateByUrl('/members');
    });
  }

  logout = () => {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  getCurrentUser = () => {
    this.accountService.currentUser$.subscribe(user => {
      // !! means if user is null then set false else set true
    }, error => {
      console.log(error);
    });
  }
}
