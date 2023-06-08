import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AssetModel } from '../models/assetModel';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { WorkorderModel } from '../models/workordermodel';
import { ConnectionService } from './connection.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'response',
};

@Injectable({
  providedIn: 'root',
})
export class WorkorderService {
  BaseUrl: string = '';

  constructor(
    private http: HttpClient,
    private ConnectionService: ConnectionService
  ) {
    this.BaseUrl = this.ConnectionService.getBaseUrl() + '/workorder';
  }

  public addWorkorder(model: WorkorderModel) {
    return this.http
      .post(<String>this.BaseUrl + '/addworkorder', model, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public SaveAssignment(model: WorkorderModel) {
    return this.http
      .post(this.BaseUrl + '/saveassignment', model, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public ItemCheckout(model: WorkorderModel) {
    return this.http
      .post(this.BaseUrl + '/saveitemcheckout', model, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public ItemCheckin(model: WorkorderModel) {
    return this.http
      .post(this.BaseUrl + '/saveitemcheckin', model, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public WorkOrderCheckin(model: WorkorderModel) {
    return this.http
      .post(this.BaseUrl + '/saveworkordercheckin', model, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public WorkOrderCheckout(model: WorkorderModel) {
    return this.http
      .post(this.BaseUrl + '/saveworkordercheckout', model, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public getWorkOrders(): Observable<WorkorderModel[]> {
    return this.http.get<WorkorderModel[]>(this.BaseUrl + '/getworkorders');
  }

  public getWorkOrdersByEmployeeId(Id: any): Observable<WorkorderModel[]> {
    return this.http.get<WorkorderModel[]>(
      this.BaseUrl + '/getworkorderbyemployeeid?Id=' + Id
    );
  }

  public getWorkOrderItems(Id: any): Observable<AssetModel[]> {
    return this.http.get<AssetModel[]>(
      this.BaseUrl + '/getworkorderitems?Id=' + Id
    );
  }

  public closeWorkOrder(Id: any): Observable<String> {
    return this.http.get<String>(this.BaseUrl + '/closeworkorder?Id=' + Id);
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
