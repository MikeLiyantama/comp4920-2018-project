import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Team } from './team.model';
import { User } from '../user.model';

@Injectable ()
export class TeamService {

    private teamsUrl = 'https://comp4920-organiser.herokuapp.com/api/team';

    constructor (private http: HttpClient) {}

    writeTeam (newTeam: Team): Promise <void | Team> {
        return this.http.post (this.teamsUrl, newTeam)
            .toPromise()
            .then(response => response as Team)
            .catch (this.handleError);
    }

    getTeam(teamId: string): Observable<Team> {
        return this.http.get<Team>(`${this.teamsUrl}/${teamId}`)
            .pipe(
                catchError(this.handleObservableError)
            );
    }

    getAllTeams(): Observable<Team[]> {
        return this.http.get<Team[]>(this.teamsUrl)
            .pipe(
                catchError(this.handleObservableError)
            );
    }

    updateTeam(updatedTeam): Promise <any> {
        const httpOptions = {};
        return this.http.put (this.teamsUrl + '/' + updatedTeam._id, updatedTeam, httpOptions)
            .toPromise()
            .then()
            .catch(this.handleError);
    }

    deleteTeam(teamToDelete: Team): Observable<void> {
        return this.http.delete<void>(`${this.teamsUrl}/${teamToDelete._id}`)
            .pipe(
                catchError(this.handleObservableError)
            );
    }

    addMemberToTeam (userToAdd, team): Promise <any> {
        const httpOptions = {};
        const url = this.teamsUrl + '/' + team._id + '/member';
        return this.http.put (url, userToAdd, httpOptions)
            .toPromise()
            .then()
            .catch(this.handleError);
    }

    removeFromTeam (memberToRemove, team): Promise <any> {
        const teamID = team._id;
        const deleteUrl = this.teamsUrl + '/' + teamID + '/member';
        const httpOptions = {};
        return this.http.request ('delete', deleteUrl, {body: memberToRemove.user})
            .toPromise()
            .then()
            .catch(this.handleError);
        //return this.http.delete (deleteUrl, httpOptions)
        //    .toPromise()
        //    .then()
        //    .catch(this.handleError);
    }


    private handleError (error: any) {
        const errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
    }

    private handleObservableError (error: any) {
        const errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.'
        );
}
}
