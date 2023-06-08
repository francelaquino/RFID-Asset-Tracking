import { Injectable } from '@angular/core';
import { TransactionModel } from '../models/transactionmodel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { WorkorderModel } from '../models/workordermodel';
import { ConnectionService } from './connection.service';
import { AssetModel } from '../models/assetModel';
import { DashboardModel } from '../models/dashboardModel';
import { LocationModel } from '../models/locationModel';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'response',
};

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  BaseUrl: string = '';

  constructor(
    private http: HttpClient,
    private ConnectionService: ConnectionService
  ) {
    this.BaseUrl = this.ConnectionService.getBaseUrl() + '/Report';
  }

  public getItemTransactionReport(model: TransactionModel) {
    return this.http
      .post<TransactionModel[]>(
        this.BaseUrl + '/TransactionReport',
        model,
        httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  public getAssetListReport(model: AssetModel) {
    return this.http
      .post<AssetModel[]>(this.BaseUrl + '/AssetListReport', model, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public getUnavailableAssetReport(model: AssetModel) {
    return this.http
      .post<AssetModel[]>(
        this.BaseUrl + '/UnavailableAssetReport',
        model,
        httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  public getLocationCountReport(): Observable<LocationModel[]> {
    return this.http.get<LocationModel[]>(this.BaseUrl + '/LocationCount');
  }

  public getWorkorderListReport(model: WorkorderModel) {
    return this.http
      .post<WorkorderModel[]>(
        this.BaseUrl + '/workorderlistreport',
        model,
        httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  public getTransactionReport(): Observable<TransactionModel[]> {
    return this.http.get<TransactionModel[]>(
      this.BaseUrl + '/TransactionReport'
    );
  }

  public getTransactionItems(Id: any, Status: any): Observable<AssetModel[]> {
    return this.http.get<AssetModel[]>(
      this.BaseUrl + '/getTransactionItems?Id=' + Id + '&Status=' + Status
    );
  }

  public getLatestTransactionItems(): Observable<AssetModel[]> {
    return this.http.get<AssetModel[]>(
      this.BaseUrl + '/getLatestTransactionItems'
    );
  }

  public getLatestTransactionCheckout(): Observable<AssetModel[]> {
    return this.http.get<AssetModel[]>(
      this.BaseUrl + '/getworkorderitemscheckout'
    );
  }
  public getDashboardCount(): Observable<DashboardModel> {
    return this.http.get<DashboardModel>(this.BaseUrl + '/getDashboardCount');
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
