import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { Http, Response, Headers } from '@angular/http';


// Adapted from: https://devcenter.heroku.com/articles/mean-apps-restful-api#create-the-contact-service-to-make-requests-to-the-api-server
@Injectable()
export class TaskService {
    // Fix url later
    private tasksUrl = 'https://comp4920-organiser.herokuapp.com/api/task';
    constructor (private http: Http) {}

    // Get request for tasks
    getTasks (): Promise<void | Task []> {
        let h = new Headers ();
        //h.append ("Access-Control-Allow-Origin", "http://localhost:4200/");
        return this.http.get (this.tasksUrl, {headers: h})
            .toPromise()
            .then (response => response.json() as Task [])
            .catch (this.handleError);
    }


    // Post request for tasks
    writeTask (newTask: Task): Promise <void | Task> {
        return this.http.post (this.tasksUrl, newTask)
                .toPromise()
                .then (response => response.json() as Task)
                .catch (this.handleError);
    }

    private handleError (error: any) {
        let errMsg = (error.message) ? error.message:
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
    }

}
