import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

// Adapted from: https://devcenter.heroku.com/articles/mean-apps-restful-api#create-the-contact-service-to-make-requests-to-the-api-server
@Injectable()
export class TaskService {
    // Fix url later
    private tasksUrl = 'https://comp4920-organiser.herokuapp.com/api/task_with_auth/';
    constructor (private http: HttpClient) {}

    // Get request for tasks
    getTasks (): Promise<void | Task []> {
        return this.http.get(this.tasksUrl)
            .toPromise()
            .then(response => response as Task [])
            .catch(this.handleError);
    }

    // Post request for tasks
    writeTask (newTask: Task): Promise <void | Task> {
        return this.http.post(this.tasksUrl, newTask)
                .toPromise()
                .then(response => response as Task)
                .catch(this.handleError);
    }

    editTask (newTask): Promise <void | Task> {
        var putUrl = this.tasksUrl + newTask._id;
        return this.http.put(putUrl, { title: newTask.title, 
                description: newTask.description, 
                importance: newTask.importance,
                completed: newTask.completed,
                deleted: newTask.deleted
                })
                .toPromise()
                .then(response => response as Task)
                .catch(this.handleError);
    }
    private handleError (error: any) {
        let errMsg = (error.message) ? error.message:
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
    }

}
