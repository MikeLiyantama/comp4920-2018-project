import { Component, Input, OnInit } from '@angular/core';
import { Team } from '../../team.model';
import { TeamMember } from '../../teammember.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { TeamService } from '../../team.service';
import { User } from '../../../user/user.model';

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
    constructor (private _formBuilder: FormBuilder, private teamService: TeamService){}

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
        console.log (this.team);
        this.team.name = this.detailsGroup.controls["NameCtrl"].value;
        this.team.description = this.detailsGroup.controls["DescCtrl"].value;
        this.teamService.updateTeam(this.team);
    }
}
