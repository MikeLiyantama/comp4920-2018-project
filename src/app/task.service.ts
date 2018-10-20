import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import omit from 'lodash/omit';

import { List } from './list.model';
import { Task } from './task.model';
import { User } from './user.model';

// Adapted from: https://devcenter.heroku.com/articles/mean-apps-restful-api#create-the-contact-service-to-make-requests-to-the-api-server
@Injectable({
  providedIn: 'root'
})
export class TaskService {

    private tasksUrl = 'http://localhost:8080/api/task';

    private listsUrl = 'https://comp4920-organiser.herokuapp.com/api/list';

    private taskListValidSource = new Subject<boolean>();

    taskListValid$ = this.taskListValidSource.asObservable();

    private taskListsValidSource = new Subject<boolean>();

    taskListsValid$ = this.taskListsValidSource.asObservable();

    private currentListSource = new BehaviorSubject<List | void>(undefined);

    currentList$ = this.currentListSource;

    constructor (private http: HttpClient) {}

    addList(newList: List): Observable<List> {
        return this.http.post<List>(this.listsUrl, newList)
            .pipe(
                catchError(this.handleError)
            );
    }

    getList(listId: string): Observable<List> {
        return this.http.get<List>(`${this.listsUrl}/${listId}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    getLists(): Observable<List[]> {
        return this.http.get<List[]>(this.listsUrl)
            .pipe(
                catchError(this.handleError)
            );
    }

    addUserToList(listId: string, userId: string): Observable<void> {
        return this.http.post<void>(`${this.listsUrl}/${listId}/collaborators/${userId}`, {})
            .pipe(
                catchError(this.handleError)
            );
    }

    removeUserFromList(listId: string, userId: string): Observable<void> {
        return this.http.delete<void>(`${this.listsUrl}/${listId}/collaborators/${userId}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Post request for tasks
    addTask(newTask: Task): Observable<Task> {
        return this.http.post<Task>(this.tasksUrl, newTask)
            .pipe(
                catchError(this.handleError)
            );
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
            );
    }

    // Get a specific task
    getTask(id) {
        return this.http.get(this.tasksUrl + '/' + id)
            .pipe(
                catchError(this.handleError)
            );
    }

    editTask(editedTask): Observable<Task> {
        return this.http.put<Task>(`${this.tasksUrl}/${editedTask._id}`, omit(editedTask, '_id'))
            .pipe(
                catchError(this.handleError)
            );
    }

    updateTaskImportance(taskId: string, important: boolean): Observable<void> {
        return this.http.put<void>(`${this.tasksUrl}/${taskId}`, { important })
            .pipe(
                catchError(this.handleError)
            );
    }

    updateTaskOrderDate(taskId: string, orderDate: string): Observable<void> {
        return this.http.put<void>(`${this.tasksUrl}/${taskId}`, { orderDate })
            .pipe(
                catchError(this.handleError)
            );
    }

    completeTask(taskId: string): Observable<void> {
        return this.http.put<void>(`${this.tasksUrl}/${taskId}`, { completed: true })
            .pipe(
                catchError(this.handleError)
            );
    }

    uncompleteTask(taskId: string): Observable<void> {
        return this.http.put<void>(`${this.tasksUrl}/${taskId}`, { completed: false })
            .pipe(
                catchError(this.handleError)
            );
    }

    deleteTask(taskId: string): Observable<void> {
        return this.http.put<void>(`${this.tasksUrl}/${taskId}`, { deleted: true })
            .pipe(
                catchError(this.handleError)
            );
    }

    moveTaskToList(taskId: string, listId: string): Observable<void> {
        return this.http.put<void>(`${this.tasksUrl}/${taskId}`, { listId })
            .pipe(
                catchError(this.handleError)
            );
    }

    invalidateTaskListStatus() {
        this.taskListValidSource.next(false);
    }

    validateTaskListStatus() {
        this.taskListValidSource.next(true);
    }

    invalidateTaskListsStatus() {
        this.taskListsValidSource.next(false);
    }

    validateTaskListsStatus() {
        this.taskListsValidSource.next(true);
    }

    setCurrentList(list: List) {
        this.currentListSource.next(list);
    }

    private handleError (error: any) {
        const errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.'
        );
    }

}
