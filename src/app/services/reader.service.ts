import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReaderModel } from '../models/readerModel';
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
export class ReaderService {
  BaseUrl: string = '';

  constructor(
    private http: HttpClient,
    private ConnectionService: ConnectionService
  ) {
    this.BaseUrl = this.ConnectionService.getBaseUrl();
  }

  public deleteReader(model: ReaderModel) {
    return this.http
      .post(this.BaseUrl + '/category/deletereader', model, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public getReaders(): Observable<ReaderModel[]> {
    return this.http.get<ReaderModel[]>(this.BaseUrl + '/reader/getreaders');
  }

  public getReaderById(Id: string): Observable<ReaderModel> {
    return this.http.get<ReaderModel>(
      this.BaseUrl + '/reader/getreaderbyid?Id=' + Id
    );
  }

  public getReaderByService(Service: string): Observable<ReaderModel[]> {
    return this.http.get<ReaderModel[]>(
      this.BaseUrl + '/reader/getreaderbyservice?Id=' + Service
    );
  }

  public addReader(model: ReaderModel) {
    return this.http
      .post(this.BaseUrl + '/reader/addreader', model, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public updateReader(model: ReaderModel) {
    return this.http
      .post(this.BaseUrl + '/reader/updatereader', model, httpOptions)
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
