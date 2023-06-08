import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConnectionService } from './connection.service';
import { AssetModel } from '../models/assetModel';
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
export class AssetService {
  BaseUrl: string = '';

  constructor(
    private http: HttpClient,
    private ConnectionService: ConnectionService
  ) {
    this.BaseUrl = this.ConnectionService.getBaseUrl() + '/asset';
  }

  public getAssets(): Observable<AssetModel[]> {
    return this.http.get<AssetModel[]>(this.BaseUrl + '/getassets');
  }

  public getAssetById(Id: string): Observable<AssetModel> {
    return this.http.get<AssetModel>(this.BaseUrl + '/getassetbyid?Id=' + Id);
  }

  public getAssetByTag(Id: string): Observable<AssetModel> {
    return this.http.get<AssetModel>(this.BaseUrl + '/getassetbytag?Id=' + Id);
  }
  public addAsset(model: AssetModel) {
    return this.http
      .post(this.BaseUrl + '/addasset', model, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public uploadAssetPicture(formData: FormData) {
    $.ajax({
      url: this.BaseUrl + '/UploadAssetPicture',
      type: 'POST',
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Disposition': 'multipart/form-data',
        Authorization: 'Basic ' + btoa('NVS:Canada@2023'),
      },
      processData: false,
      contentType: false,
      success: function (data) {},
    });
  }

  public addBulkAsset(model: AssetModel) {
    return this.http
      .post(this.BaseUrl + '/addbulkasset', model, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public updateAsset(model: FormData) {
    return this.http
      .post(this.BaseUrl + '/updateasset', model, httpOptions)
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
