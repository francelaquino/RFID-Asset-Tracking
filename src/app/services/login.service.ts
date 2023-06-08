import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReaderModel } from '../models/readerModel';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { ConnectionService } from './connection.service';
import { LoginModel } from '../models/loginModel';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'response',
};

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  BaseUrl: string = '';

  constructor(
    private http: HttpClient,
    private ConnectionService: ConnectionService
  ) {
    this.BaseUrl = this.ConnectionService.getBaseUrl() + '/login';
  }

  public verifyLogin(model: LoginModel) {
    return this.http
      .post<LoginModel>(this.BaseUrl + '/authenticate', model, httpOptions)
      .pipe(
        retry(1),
        map((response) => response.body),
        catchError(this.handleError)
      );
  }

  public createSession(model: LoginModel) {
    localStorage.setItem('Username', model.Username);
    localStorage.setItem('Name', model.Name);
    localStorage.setItem('IsLogin', '1');
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
