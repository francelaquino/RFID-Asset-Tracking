import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../models/usermodel';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ConnectionService } from './connection.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'response',
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  BaseUrl: string = '';

  constructor(
    private http: HttpClient,
    private ConnectionService: ConnectionService
  ) {
    this.BaseUrl = this.ConnectionService.getBaseUrl() + '/user';
  }

  public getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.BaseUrl + '/getusers');
  }

  public getUserById(Id: string): Observable<UserModel> {
    return this.http.get<UserModel>(this.BaseUrl + '/getuserbyid?Id=' + Id);
  }

  public addUser(model: UserModel) {
    return this.http
      .post(this.BaseUrl + '/adduser', model, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public updateUser(model: UserModel) {
    return this.http
      .post(this.BaseUrl + '/updateuser', model, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public resetPassword(model: UserModel) {
    return this.http
      .post(this.BaseUrl + '/resetpassword', model, httpOptions)
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
}
