
import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { CategoryModel } from '../models/categoryModel'; 
import { TypeModel } from '../models/typeModel';
import { logsModel } from '../models/logsModel';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ConnectionService } from './connection.service';
import { LocationModel } from '../models/locationModel';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'response'
};



@Injectable({
  providedIn: 'root'
})
export class UtilityService {

BaseUrl :string= '';

constructor(private http: HttpClient, private ConnectionService: ConnectionService) {
  this.BaseUrl = this.ConnectionService.getBaseUrl();
 }




public getTransactions(): Observable<logsModel[]> {
  return this.http.get<logsModel[]>(this.BaseUrl+"/tag/searchtagsinout");
}

public getCategories(): Observable<CategoryModel[]> {
  return this.http.get<CategoryModel[]>(this.BaseUrl+"/category/getcategories");
}
public getCategoryById(Id:string): Observable<CategoryModel> {
  return this.http.get<CategoryModel>(this.BaseUrl+"/category/getcategorybyid?Id="+Id);
}

public addCategory(model: CategoryModel) {

  return this.http.post(this.BaseUrl + '/category/addcategory', model, httpOptions)
  .pipe(
    retry(1), catchError(this.handleError)
  );
  

}

public updateCategory(model: CategoryModel) {

  return this.http.post(this.BaseUrl + '/category/updatecategory', model, httpOptions)
  .pipe(
    retry(1), catchError(this.handleError)
  );
  

}


public deleteCategory(model: CategoryModel) {

  return this.http.post(this.BaseUrl + '/category/deletecategory', model, httpOptions)
  .pipe(
    retry(1), catchError(this.handleError)
  );
  

}

public deleteType(model: TypeModel) {

  return this.http.post(this.BaseUrl + '/type/deletetype', model, httpOptions)
  .pipe(
    retry(1), catchError(this.handleError)
  );
  

}


public getTypes(): Observable<TypeModel[]> {
  return this.http.get<TypeModel[]>(this.BaseUrl+"/type/gettypes");
}

public getTypeById(Id:string): Observable<TypeModel> {
  return this.http.get<TypeModel>(this.BaseUrl+"/type/gettypebyid?Id="+Id);
}

public addType(model: TypeModel) {

  return this.http.post(this.BaseUrl + '/type/addtype', model, httpOptions)
  .pipe(
    retry(1), catchError(this.handleError)
  );
  

}

public updateType(model: TypeModel) {

  return this.http.post(this.BaseUrl + '/type/updatetype', model, httpOptions)
  .pipe(
    retry(1), catchError(this.handleError)
  );
  

}



public deleteLocation(model: LocationModel) {

  return this.http.post(this.BaseUrl + '/location/deletelocation', model, httpOptions)
  .pipe(
    retry(1), catchError(this.handleError)
  );
  

}


public getLocations(): Observable<LocationModel[]> {
  return this.http.get<LocationModel[]>(this.BaseUrl+"/location/getlocations");
}

public getLocationById(Id:string): Observable<LocationModel> {
  return this.http.get<LocationModel>(this.BaseUrl+"/location/getlocationbyid?Id="+Id);
}

public addLocation(model: LocationModel) {

  return this.http.post(this.BaseUrl + '/location/addlocation', model, httpOptions)
  .pipe(
    retry(1), catchError(this.handleError)
  );
  

}

public updateLocation(model: LocationModel) {

  return this.http.post(this.BaseUrl + '/location/updatelocation', model, httpOptions)
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