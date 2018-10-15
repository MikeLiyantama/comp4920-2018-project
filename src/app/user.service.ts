import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = 'https://comp4920-organiser.herokuapp.com/api/users';

  constructor (private http: HttpClient) { }

  // Get request for all users  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
        .pipe(
            catchError(this.handleError),
        );
  }

  private handleError (error: any) {
        let errMsg = (error.message) ? error.message:
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.'
        );
  }

}
