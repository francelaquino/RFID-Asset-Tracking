import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConnectionService } from './connection.service';
import {
  AccessGroupCheckList,
  AccessGroupDTO,
  AccessGroupListModel,
  AccessGroupModel,
  UserAccessDTO,
} from '../models/accessgroupModel';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import * as $ from 'jquery';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'response',
};

@Injectable({
  providedIn: 'root',
})
export class AccessService {
  BaseUrl: string = '';

  constructor(
    private http: HttpClient,
    private ConnectionService: ConnectionService
  ) {
    this.BaseUrl = this.ConnectionService.getBaseUrl() + '/access';
  }

  public getAccessGroupList(): Observable<AccessGroupListModel[]> {
    return this.http.get<AccessGroupListModel[]>(
      this.BaseUrl + '/getaccessgrouplist'
    );
  }

  public getAccessGroup(): Observable<AccessGroupModel[]> {
    return this.http.get<AccessGroupModel[]>(this.BaseUrl + '/getaccessgroup');
  }
  public getAccessGroupDTO(): Observable<AccessGroupDTO[]> {
    return this.http.get<AccessGroupDTO[]>(this.BaseUrl + '/getaccessgroup');
  }
  public getUserGroup(Id: string): Observable<string[]> {
    return this.http.get<string[]>(this.BaseUrl + '/getusergroup?Id=' + Id);
  }

  public getAccessGroupCheckList(
    Id: string
  ): Observable<AccessGroupCheckList[]> {
    return this.http.get<AccessGroupCheckList[]>(
      this.BaseUrl + '/getaccessgroupchecklist?Id=' + Id
    );
  }

  public saveAccessGroupList(model: AccessGroupListModel) {
    return this.http
      .post(this.BaseUrl + '/saveaccessgrouplist', model, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public saveUserGroup(model: UserAccessDTO) {
    return this.http
      .post(this.BaseUrl + '/saveusergroup', model, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }

  public getUserRoles(): Observable<string> {
    const username = localStorage.getItem('Username');
    return this.http.get<string>(this.BaseUrl + '/getuserroles?Id=' + username);
  }
}
