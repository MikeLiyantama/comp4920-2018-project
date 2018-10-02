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
  

  authenticate(user, pass):Observable<any> {
    return  this.http.post(this.authUrl, {"email": user, "password": pass});
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
