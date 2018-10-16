import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Message } from './discussion/message/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messagesUrl = 'https://comp4920-organiser.herokuapp.com/api/messages';

  private messagesValidSource = new Subject<{teamId: string, valid: boolean}>();

  messagesValid$ = this.messagesValidSource.asObservable();

  constructor (private http: HttpClient) { }

  getMessagesForTeam(teamId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.messagesUrl}/team/${teamId}`)
      .pipe(
        catchError(this.handleError),
      )
  }

  sendMessageToTeam(message: string, teamId: string): Observable<void> {
    return this.http.post<void>(`${this.messagesUrl}/team/${teamId}`, new Message(message))
      .pipe(
        catchError(this.handleError),
      )
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

  invalidateMessagesForTeam(teamId: string) {
      this.messagesValidSource.next({ teamId, valid: false });
  }

  validateMessagesForTeam(teamId: string) {
      this.messagesValidSource.next({ teamId, valid: true });
  }
}
