import { Component, OnInit } from '@angular/core';
import { Team } from '../team.model';
import { TeamMember } from '../teammember.model';
import { TeamService } from '../team.service';

@Component({
    selector: 'app-teamdash',
    templateUrl: './teamdash.component.html',
    styleUrls: ['./teamdash.component.css'],
    providers: [ TeamService ]
})

export class TeamDashComponent implements OnInit {
    showOverview: boolean = true;
    showDetail: boolean = false;
    receivedTeam: Team;
    ngOnInit () {

    }

    contextSwitch (event) {
    //console.log ("Inside context switch");
    //    console.log ("context switch event: ", event);
        this.receivedTeam = event;
        this.showOverview = false;
        this.showDetail = true;
    }
}
