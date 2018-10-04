import { Injectable } from '@angular/core';
import { HttpClient } from '../../node_modules/@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SignupserviceService {

  constructor(
    private http: HttpClient
  ) { }

  private registerUrl = "https://comp4920-organiser.herokuapp.com/api/register";
  register(user, pass, name, email): Observable<any>{
      return this.http.put(this.registerUrl, {"username": user, 
      "password": pass,
      "name": name,
      "email": email
      });
  }
}
 
