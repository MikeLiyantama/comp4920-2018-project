import { Injectable } from '@angular/core';
import { HttpClient } from '../../node_modules/@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  constructor(private http: HttpClient) { }

  private returnValue: number;
  

  authenticate(user, pass){
    this.http.post("https://comp4920-organiser.herokuapp.com/api/auth", {"email": user, "password": pass})
      .subscribe( function (res){
        this.returnValue = res;
        console.log("1");
        console.log("2");
  
        if (this.returnValue.success === "true" ) {
          this.returnValue = 1;
        } else {
          this.returnValue = 0;
        }
    })

    console.log("3");
    return this.returnValue;
  
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
