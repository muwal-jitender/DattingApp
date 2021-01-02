import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  // It is kind of like a buffer object, store the value inside here
  // Anytime a subscriber subscribe to it, it will emit the last value inside it
  // 1 means we will going to store only one user, it like size of a bugger
  private currentUserSource = new ReplaySubject<User>(1);
  // By convention we add $ sign to observables
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private presence: PresenceService) { }
  login = (model: any) => {
    return this.http.post<User>(`${this.baseUrl}account/login`, model).pipe(
      map((res: User) => {
        const user = res;
        if (user) {
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
      })
    );
  }
  register = (model: any) => {
    return this.http.post<User>(`${this.baseUrl}account/register`, model).pipe(map((user: User) => {
      if (user) {
        this.setCurrentUser(user);
        this.presence.createHubConnection(user);
      }
    }));
  }
  setCurrentUser = (user: User) => {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout = () => {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presence.stopHubConnection();
  }

  getDecodedToken = (token: string) => {
    // atob allows us to decode the value inside token is returning
    // token is not encrypted only the signature part is encrupted
    return JSON.parse(atob(token.split('.')[1]));
  }

}
