import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'https://localhost:5001/api/';
  // It is kind of like a buffer object, store the value inside here
  // Anytime a subscriber subscribe to it, it will emit the last value inside it
  // 1 means we will going to store only one user, it like size of a bugger
  private currentUserSource = new ReplaySubject<User>(1);
  // By convention we add $ sign to observables
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }
  login = (model: any) => {
    return this.http.post<User>(`${this.baseUrl}account/login`, model).pipe(
      map((res: User) => {
        const user = res;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }
  register = (model: any) => {
    return this.http.post<User>(`${this.baseUrl}account/register`, model).pipe(map((user: User) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);
      }
    }));
  }
  setCurrentUser = (user: User) => {
    this.currentUserSource.next(user);
  }

  logout = () => {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
