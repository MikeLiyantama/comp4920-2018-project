import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Team } from '../team.model';
import { TeamMember } from '../teammember.model';

import { AppbarService } from '../../appbar.service';
import { TeamService } from '../team.service';

@Component({
    selector: 'app-teamdash',
    templateUrl: './teamdash.component.html',
    styleUrls: ['./teamdash.component.css'],
    providers: [ TeamService ]
})

export class TeamDashComponent implements OnInit {

    loading: boolean = true;
    teams: Team[];
    numTeams = 0;
    gridTiles = 0;

    constructor (private appbarService: AppbarService, private teamService: TeamService) {}

    ngOnInit () {
        this.teamService.getAllTeams().subscribe((teams) => { 
            this.teams = teams; 
            this.gridTiles = this.getNumGridTiles();
            this.loading = false;
        });
        this.appbarService.setTitle('My Teams');
    }

    getNumGridTiles () {
        let size;
        if (this.teams.length < 3) {
            size = this.teams.length;
        } else {
            size = 3;
        }
        return size;
    }

    deleteTeam(deletedTeam) {
        this.teamService.deleteTeam(deletedTeam).subscribe(() => {
            this.teams = this.teams.filter(team => team._id !== deletedTeam._id);
            this.gridTiles = this.getNumGridTiles();
        });
    }
}
