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
    this.http.post("https://comp4920-organiser.herokuapp.com/api/auth", { user, pass}).subscribe( function (res){
	console.log(res);
})
    
    return this.returnValue;
  
  }

  function(res, returnValue) {
    this.returnValue = res.success;
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
