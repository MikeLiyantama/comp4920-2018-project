import { Injectable } from '@angular/core';
import { HttpClient } from '../../node_modules/@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, subscribeOn } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
 
  constructor(private http: HttpClient) { }

  private returnValue;
  private authUrl = "https://comp4920-organiser.herokuapp.com/api/auth";
  private updateAccountUrl = "https://comp4920-organiser.herokuapp.com/api/account/change/";
  

  authenticate(user, pass):Observable<any> {
    return  this.http.post(this.authUrl, {"email": user, "password": pass});
  }

  updatePassword(email, n_pass){
    return this.http.put( this.updateAccountUrl + email, {"password" : n_pass} );
  }

  updateEmail(email, n_email){
    return this.http.put( this.updateAccountUrl + email, {"email" : n_email} );
  }
}
