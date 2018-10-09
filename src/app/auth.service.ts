import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '../../node_modules/@angular/common/http';
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
  private checkUrl = "https://comp4920-organiser.herokuapp.com/api/account/check/" // add email
  private verifyUrl = "https://comp4920-organiser.herokuapp.com/api/account/email_verification"
  private changeUrl = "https://comp4920-organiser.herokuapp.com/api/account/change/" // add email
  

  authenticate(user, pass):Observable<any> {
    return  this.http.post(this.authUrl, {"email": user, "password": pass});
  }

  updatePassword(email, n_pass): Observable<any>{
    return this.http.put( this.updateAccountUrl + email, {"password" : n_pass} );
  }
  
  checkEmail(email):Observable<any> {
    var checkUrl = this.checkUrl + email;
    return this.http.get(checkUrl);
  }

  validate(email):Observable<any> {
    return this.http.post(this.verifyUrl, {"email": email});
  }

  changeEmail(email, newPassword):Observable<any> {
    var changeUrl = this.changeUrl + email;
    return this.http.put(changeUrl, {"password": newPassword});
  }

  updateEmail(email, n_email) : Observable<any>{
    return this.http.put( this.updateAccountUrl + email, {"email" : n_email} );
  }

  getCurrentUser() : Observable<any>{
    return this.http.get("https://comp4920-organiser.herokuapp.com/api/me");
  }
}
