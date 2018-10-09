import { Injectable } from '@angular/core';
import { Team } from './team.model';
import { User } from '../user/user.model';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable ()
export class TeamService {
    private teamsUrl = 'https://comp4920-organiser.herokuapp.com/api/team';
    private usersUrl = 'https://comp4920-organiser.herokuapp.com/api/users';
    private meUrl = 'https://comp4920-organiser.herokuapp.com/api/me';
    constructor (private http: HttpClient) {}
    
    // Get request for the current user
    getMe (): Promise<void | any> {
        return this.http.get(this.meUrl)
            .toPromise()
            .then (response => response as User)
            .catch (this.handleError);
    }

    // Get request for all users
    getAllUsers (): Promise <void | any> {
        return this.http.get(this.usersUrl)
            .toPromise()
            .then (response => response as User [])
            .catch (this.handleError);
    }

    writeTeam (newTeam: Team): Promise <void | Team> {
        return this.http.post (this.teamsUrl, newTeam)
            .toPromise()
            .then(response => response as Team)
            .catch (this.handleError);
    }
    
    getAllTeams (): Promise <void | Team []> {
        return this.http.get(this.teamsUrl)
            .toPromise ()
            .then (response => response as Team [])
            .catch (this.handleError)
    }

    updateTeam (updatedTeam): Promise <any> {
        const httpOptions = {};
        return this.http.put (this.teamsUrl + "/" + updatedTeam._id, updatedTeam, httpOptions)
            .toPromise()
            .then()
            .catch(this.handleError);
    }

    deleteTeam (teamToDelete): Promise <any> {
        return this.http.delete (this.teamsUrl + "/" + teamToDelete._id)
            .toPromise()
            .then()
            .catch (this.handleError);
    }

    addMemberToTeam (userToAdd, team): Promise <any> {
        const httpOptions = {};
        var url = this.teamsUrl + "/" + team._id + "/member";
        return this.http.put (url, userToAdd, httpOptions)
            .toPromise()
            .then()
            .catch(this.handleError);
    }

    removeFromTeam (memberToRemove, team): Promise <any> {
        var teamID = team._id;
        var deleteUrl = this.teamsUrl + "/" + teamID + "/member";
        const httpOptions = {}
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
        let errMsg = (error.message) ? error.message:
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
    }
}
