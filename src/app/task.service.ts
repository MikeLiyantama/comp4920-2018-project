import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
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

    private taskListValidSource = new Subject<boolean>();

    taskListValid$ = this.taskListValidSource.asObservable();

    constructor (private http: HttpClient) {}

    // Post request for tasks
    addTask(newTask: Task): Observable<Task> {
        return this.http.post<Task>(this.tasksUrl, newTask)
            .pipe(
                catchError(this.handleError)
            )
    }

    // Get request for tasks
    getTasks(filters: Object = {}): Observable<Task []> {
        let params = new HttpParams();
        Object.entries(filters).forEach(([filter, value]) => {
            params = params.append(filter, value);
        });
        const options = { params };
        return this.http.get<Task []>(this.tasksUrl, options)
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

    updateTaskImportance(taskId: string, important: boolean): Observable<any> {
        return this.http.put(`${this.tasksUrl}/${taskId}`, { important })
            .pipe(
                catchError(this.handleError)
            )
    }

    updateTaskOrderDate(taskId: string, orderDate: string): Observable<any> {
        return this.http.put(`${this.tasksUrl}/${taskId}`, { orderDate })
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

    uncompleteTask(taskId: string): Observable<any> {
        return this.http.put(`${this.tasksUrl}/${taskId}`, { completed: false })
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

    invalidateTaskListStatus() {
        this.taskListValidSource.next(false);
    }

    validateTaskListStatus() {
        this.taskListValidSource.next(true);
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
