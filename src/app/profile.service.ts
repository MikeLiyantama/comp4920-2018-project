import { Injectable } from '@angular/core';
import { HttpClient} from '../../node_modules/@angular/common/http';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private userDataUrl = 'https://comp4920-organiser.herokuapp.com/api/account/data'
  constructor(
    private http: HttpClient
  ) { }

  getUserData(): Observable<any> {
    return this.http.get(this.userDataUrl);
  }
}
