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
    // this.http.post("https://comp4920-organiser.herokuapp.com/api/auth", {"email": user, "password": pass})
    //   .subscribe((res) => {
    //     this.returnValue = res;
    //     console.log("1");
    //     console.log("2");
        
    //     console.log(typeof this.returnValue.success);
  
    //     if (this.returnValue.success === true ) {
    //       console.log("4");
    //       this.returnValue = 1;
    //     } else {
    //       console.log("5");
    //       this.returnValue = 0;
    //     }
    // })

    // console.log("3");
    // return this.returnValue;
    console.log("2");
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
