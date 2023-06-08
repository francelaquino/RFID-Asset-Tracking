import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ConnectionService } from './connection.service';
import { LookupModel } from '../models/lookupModel';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'response'
};



@Injectable({
  providedIn: 'root'
})
export class LookupService {

BaseUrl :string= '';

constructor(private http: HttpClient, private ConnectionService: ConnectionService) {
  this.BaseUrl = this.ConnectionService.getBaseUrl()+'/lookup';
 }


 public getLocations(): Observable<LookupModel[]> {
  return this.http.get<LookupModel[]>(this.BaseUrl+"/getlocations");
}

public getCategories(): Observable<LookupModel[]> {
  return this.http.get<LookupModel[]>(this.BaseUrl+"/getcategories");
}

public getTypes(): Observable<LookupModel[]> {
  return this.http.get<LookupModel[]>(this.BaseUrl+"/gettypes");
}

public getReaders(): Observable<LookupModel[]> {
  return this.http.get<LookupModel[]>(this.BaseUrl+"/getreaders");
}

public getStations(): Observable<LookupModel[]> {
  return this.http.get<LookupModel[]>(this.BaseUrl+"/getstations");
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