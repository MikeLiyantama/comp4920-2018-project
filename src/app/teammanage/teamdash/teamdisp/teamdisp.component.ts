import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Team } from '../../team.model';
import { TeamMember } from '../../teammember.model';
import { TeamService } from '../../team.service';

@Component({
    selector: 'app-teamdisp',
    templateUrl: './teamdisp.component.html',
    styleUrls: ['./teamdisp.component.css'],
    providers: [ TeamService ]
})

export class TeamDisplayComponent implements OnInit {
    @Output () teamEmitter = new EventEmitter <Team> ();
    @Output () detailsContextEmitter = new EventEmitter <Team> ();
    teams: Team [];
    numTeams = 0;
    gridTiles = 0;

    constructor (private teamService: TeamService) {}

    public getNumGridTiles () {
        var size;
        if (this.numTeams < 3) {
            size = this.numTeams;
        } else {
            size = 3;
        }
        return size;
    }

    public setTeams (teamsData) {
        teamsData.forEach (function (team) {
            if (team.hasOwnProperty ('title')) {
                Object.defineProperty (team, 'name',
                    Object.getOwnPropertyDescriptor(team, 'title'));
                delete team['title'];
            }
        });
        this.teams = teamsData;
        this.numTeams = this.teams.length;
        this.gridTiles = this.getNumGridTiles();
        console.log ("the number of grid tiles: ", this.gridTiles);
        console.log ("the team data");
        console.log (teamsData);
    }

    public deleteTeam (event) {
        console.log ("Event object: ", event);
        var n = this.teams.indexOf (event);
        this.teams.splice (n, 1);
        this.teamService.deleteTeam (event);
    }

    public switchToDetails (event) {
        this.detailsContextEmitter.emit (event);
    }


    ngOnInit () {
        this.teamService.getAllTeams().then (data => this.setTeams(data));
    }

}
