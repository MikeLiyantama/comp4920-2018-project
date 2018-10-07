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
  private checkUrl = "https://comp4920-organiser.herokuapp.com/api/check/" // add email
  private verifyUrl = "https://comp4920-organiser.herokuapp.com/api/account/email_verification"
  private changeUrl = "https://comp4920-organiser.herokuapp.com/api/change" // add email
  

  authenticate(user, pass):Observable<any> {
    return  this.http.post(this.authUrl, {"email": user, "password": pass});
  }

  checkEmail(email):Observable<any> {
    var checkUrl = this.checkUrl + email;
    return this.http.get(this.checkUrl);

  }

  validate(email):Observable<any> {
    return this.http.post(this.verifyUrl, {"email": email});
  }

  changeEmail(email, newPassword):Observable<any> {
    this.changeUrl = this.changeUrl + email;
    return this.http.put(this.changeUrl, {"password": newPassword});
  }

  

  // private username = "user"; private password = "pass";              // local testing
  // authenticateLocally(user, pass) {
  //   if (user === this.username && pass === this.password) {        
  //       return 1;
  //     } else {
  //       return 0;
  //     }
  // }
}
