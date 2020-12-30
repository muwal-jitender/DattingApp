import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
// Services are singleton so they remains alive until the application is closed
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User;
  userParams: UserParams;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    });
  }
  getUserParams = () => {
    return this.userParams;
  }

  setUserParams = (userParams: UserParams) => {
    this.userParams = userParams;
  }

  resetUserParams = () => {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers = (userParams: UserParams) => {

    const response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) {
      return of(response);
    }
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<Member[]>(`${this.baseUrl}users`, params)
      .pipe(map(res => {
        this.memberCache.set(Object.values(userParams).join('-'), res);
        return res;
      }));
  }



  getMember = (username: string) => {

    const memeber: Member = [...this.memberCache.values()]
      .reduce((arr: Member[], elem: PaginatedResult<Member>) => arr.concat(elem.result), [])
      .find((member: Member) => member.username === username);
    if (memeber) {
      return of(memeber);
    }
    return this.http.get<Member>(`${this.baseUrl}users/${username}`);
  }

  updateMember = (member: Member) => {
    return this.http.put(`${this.baseUrl}users`, member).pipe(map(() => {
      const index = this.members.indexOf(member);
      this.members[index] = member;
    }));
  }
  setMainPhoto = (photoId: number) => {
    return this.http.put(`${this.baseUrl}users/set-main-photo/${photoId}`, {});
  }

  deletePhoto = (photoId: number) => {
    return this.http.delete(`${this.baseUrl}users/delete-photo/${photoId}`);
  }

  private getPaginationHeaders = (pageNumber: number, pageSize: number) => {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return params;
  }

  private getPaginatedResult = <T>(url: string, params: HttpParams) => {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        const paginationHeader = response.headers.get('Pagination');
        if (paginationHeader !== null) {
          paginatedResult.pagination = JSON.parse(paginationHeader);
        }
        return paginatedResult;
      })
    );
  }
}
