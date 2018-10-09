import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Team } from '../../team.model';
import { TeamMember } from '../../teammember.model';
import { User } from '../../../user/user.model';

import { AppbarService } from '../../../appbar.service';
import { TeamService } from '../../team.service';

@Component({
    selector: 'app-teamdetail',
    templateUrl: './teamdetail.component.html',
    styleUrls: ['./teamdetail.component.css'],
    providers: [ TeamService ]
})


export class TeamDetailsComponent implements OnInit {
    @Input () team: Team;
    myControl = new FormControl ();
    allUsers: User [];
    detailsGroup: FormGroup;
    membersGroup: FormGroup;
    constructor (
        private appbarService: AppbarService,
        private _formBuilder: FormBuilder,
        private teamService: TeamService
    ) { }

    ngOnInit () {
        this.detailsGroup = this._formBuilder.group({
            NameCtrl: ['', Validators.required],
            DescCtrl: ['', Validators.required]
        });
        this.membersGroup = this._formBuilder.group({
            SearchCtrl: ['', Validators.required]
        });
    }
    
    setImage (givenFile) {
        this.team.banner = givenFile; 
    }

    saveChanges () {
        this.team.name = this.detailsGroup.controls["NameCtrl"].value;
        this.team.description = this.detailsGroup.controls["DescCtrl"].value;
        this.teamService.updateTeam(this.team);
    }

    addToTeam (event) {
        var exists = this.team.members.some (function (a) {
            return a.user.username == event.username;
        });
        if (!exists) {
            this.team.members.push (new TeamMember (event, false, false));
            this.teamService.addMemberToTeam (event, this.team);
        }
    }

    removeFromTeam (event) {
        // event should be emitted member from memcard component
        var n = this.team.members.indexOf(event);
        this.team.members.splice (n, 1);
        this.teamService.removeFromTeam(event, this.team);
    }
}
