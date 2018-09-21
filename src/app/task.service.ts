import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Task } from './task.model';

// Adapted from: https://devcenter.heroku.com/articles/mean-apps-restful-api#create-the-contact-service-to-make-requests-to-the-api-server
@Injectable({
  providedIn: 'root'
})
export class TaskService {

    // Fix url later
    private tasksUrl = 'https://comp4920-organiser.herokuapp.com/api/task';

    private taskEditedSource = new Subject<boolean>();

    taskEdited$ = this.taskEditedSource.asObservable();

    constructor (private http: HttpClient) {}

    // Get request for tasks
    getTasks(): Observable<Task []> {
        return this.http.get<Task []>(this.tasksUrl)
            .pipe(
                catchError(this.handleError)
            )
    }

    // Post request for tasks
    writeTask(newTask: Task): Observable<Task> {
        return this.http.post<Task>(this.tasksUrl, newTask)
            .pipe(
                catchError(this.handleError)
            )
    }

    editTask(editedTask): Observable<Task> {
        return this.http.put<Task>(
                `${this.tasksUrl}/${editedTask._id}`, 
                { 
                    title: editedTask.title, 
                    description: editedTask.description,
                }
            )
            .pipe(
                catchError(this.handleError)
            )
    }

    completeTask(taskId: string): Observable<any> {
        return this.http.put(`${this.tasksUrl}/${taskId}`, { completed: true })
            .pipe(
                catchError(this.handleError)
            )
    }

    deleteTask(taskId: string): Observable<any> {
        return this.http.put(`${this.tasksUrl}/${taskId}`, { deleted: true })
            .pipe(
                catchError(this.handleError)
            )
    }

    changeTaskEditedStatus(edited) {
        this.taskEditedSource.next(edited);
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
