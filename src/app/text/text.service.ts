import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TextService {

  constructor(private http: HttpClient) { }

  checkAvailable(site){
    return this.http.get(environment.apiBaseUrl+"/checkingAvailableOrNot",{params:site});
  }

  getContent(site){
    return this.http.get(environment.apiBaseUrl+"/getTextFromDatabase",{params:site});
  }

  createUser(user){
    return this.http.post(environment.apiBaseUrl+"/createSpaceAndStore",user);
  }

  updateContent(space){
    return this.http.post(environment.apiBaseUrl+"/updateTheContentOfDatabase",space);
  }

  checkAuth(user){
    return this.http.get(environment.apiBaseUrl+"/checkingAuthorizedOrNot",{params:user});
  }

}
