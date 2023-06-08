import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  public baseUrl: string = '';
  constructor() {}

  getBaseUrl() {
    this.baseUrl = '';
    return this.baseUrl;
  }
}
