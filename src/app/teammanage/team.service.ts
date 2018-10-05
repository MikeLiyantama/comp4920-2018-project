import { Injectable } from '@angular/core';
import { Team } from './team.model';
import { User } from '../user/user.model';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable ()
export class TeamService {
    private teamsUrl = 'https://comp4920-organiser.herokuapp.com/api/team';kkkjjj
    private usersUrl = 'https://comp4920-organiser.herokuapp.com/api/users';
    private meUrl = 'https://comp4920-organiser.herokuapp.com/api/me';
    constructor (private http: HttpClient) {}
    
    // Get request for the current user
    getMe (): Promise<void | User> {
        return this.http.get(this.meUrl)
            .toPromise()
            .then (response => response as User)
            .catch (this.handleError);
    }

    // Get request for all users
    getAllUsers (): Promise <void | User []> {
        return this.http.get(this.usersUrl)
            .toPromise()
            .then (response => response as User [])
            .catch (this.handleError);
    }


    private handleError (error: any) {
        let errMsg = (error.message) ? error.message:
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
    }
}
