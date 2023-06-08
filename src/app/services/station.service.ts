
import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { StationModel } from '../models/stationModel'; 
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ConnectionService } from './connection.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'response'
};

@Injectable({
  providedIn: 'root'
})
export class StationService {

  BaseUrl :string= '';

  constructor(private http: HttpClient, private ConnectionService: ConnectionService) {
    this.BaseUrl = this.ConnectionService.getBaseUrl();
   }



  
  public deleteStation(model: StationModel) {

    return this.http.post(this.BaseUrl + '/station/deletestation', model, httpOptions)
    .pipe(
      retry(1), catchError(this.handleError)
    );
    
  
  }

public getStations(): Observable<StationModel[]> {
  return this.http.get<StationModel[]>(this.BaseUrl+"/station/getstations");
}

public getStationById(Id:string): Observable<StationModel> {
  return this.http.get<StationModel>(this.BaseUrl+"/station/getstationbyid?Id="+Id);
}

public addStation(model: StationModel) {

  return this.http.post(this.BaseUrl + '/station/addstation', model, httpOptions)
  .pipe(
    retry(1), catchError(this.handleError)
  );
  

}

public updateStation(model: StationModel) {

  return this.http.post(this.BaseUrl + '/station/updatestation', model, httpOptions)
  .pipe(
    retry(1), catchError(this.handleError)
  );
  

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

