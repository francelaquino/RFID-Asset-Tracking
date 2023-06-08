import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { TagModel } from '../models/tagmodel';
import { retry, catchError } from 'rxjs/operators';
import { ConnectionService } from './connection.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  BaseUrl :string= '';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private http: HttpClient, private ConnectionService: ConnectionService) {
    this.BaseUrl = this.ConnectionService.getBaseUrl()+'/tag';
   }

  public checkTagIfExist(Tag: string, Id: string): Observable<TagModel> {
    return this.http.get<TagModel>(this.BaseUrl + "/checkTagIfExist?Tag=" + Tag+"&Id="+Id).pipe(
      retry(1), catchError(this.handleError));

      
  }


  public searchTagByRfid(Tag: string): Observable<TagModel> {
    return this.http.get<TagModel>(this.BaseUrl + "/searchTagByRfid?Tag=" + Tag).pipe(
      retry(1), catchError(this.handleError));

      
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


