import { Injectable } from '@angular/core';
import { HttpClient } from '../../node_modules/@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(
    private http: HttpClient
  ) { }

  private registerUrl = 'https://comp4920-organiser.herokuapp.com/api/register';
  register(newUser): Observable<any> {
      return this.http.put(this.registerUrl, newUser);
      //{
      //"username": user,
      //"password": pass,
      //"name": name,
      //"email": email
      //});
  }
}

