import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmployeeModel } from '../models/employeeModel';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ConnectionService } from './connection.service';

const httpOptions = {
  observe: 'response' as 'response',
};

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  BaseUrl: string = '';

  constructor(
    private http: HttpClient,
    private ConnectionService: ConnectionService
  ) {
    this.BaseUrl = this.ConnectionService.getBaseUrl() + '/employee';
  }

  public getEmployees(): Observable<EmployeeModel[]> {
    return this.http.get<EmployeeModel[]>(this.BaseUrl + '/getemployees');
  }

  public getEmployeeById(Id: string): Observable<EmployeeModel> {
    return this.http.get<EmployeeModel>(
      this.BaseUrl + '/getemployeebyid?Id=' + Id
    );
  }

  public getEmployeeByEmployeeId(Id: string): Observable<EmployeeModel> {
    return this.http.get<EmployeeModel>(
      this.BaseUrl + '/getemployeebyemployeeid?Id=' + Id
    );
  }

  public getEmployeeByRFID(Id: string): Observable<EmployeeModel> {
    return this.http.get<EmployeeModel>(
      this.BaseUrl + '/getemployeebyrfid?RFID=' + Id
    );
  }

  public addEmployee(model: EmployeeModel) {
    return this.http
      .post(this.BaseUrl + '/addemployee', model, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public updateEmployee(model: EmployeeModel) {
    return this.http
      .post(this.BaseUrl + '/updateemployee', model, httpOptions)
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
