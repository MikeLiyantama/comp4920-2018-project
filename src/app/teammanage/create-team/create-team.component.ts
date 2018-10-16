import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith  } from 'rxjs/operators';

import { Team } from '../team.model';
import { TeamMember } from '../teammember.model';
import { User } from '../../user.model';

import { AppbarService } from '../../appbar.service';
import { AuthService } from '../../auth.service';
import { TeamService } from '../team.service';
import { UserService } from '../../user.service';

@Component({
    selector: 'app-create-team',
    templateUrl: './create-team.component.html',
    styleUrls: ['./create-team.component.css'],
    providers: [TeamService]
})

export class CreateTeamComponent implements OnInit {

    myControl = new FormControl (); 
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    filteredUsers: Observable <User[]>;
    selectedTeamMembers: TeamMember [] = [];
    enteredTeamName: string;
    enteredTeamDescription: string;
    givenTeamBanner: any;
    currentCreator: TeamMember;
    summaryTeam: Team;
    usersToExcludeFromUserSelector: User[] = [];
    creating: boolean = false;

    constructor (
        private _formBuilder: FormBuilder,
        private appbarService: AppbarService,
        private authService: AuthService,
        private teamService: TeamService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.firstFormGroup = this._formBuilder.group({
            NameCtrl: ['', Validators.required],
            DescCtrl: [''],
        });

        // Set the current user
        const me = this.authService.getDecodedToken();
        this.usersToExcludeFromUserSelector = [ me ];
        this.currentCreator = new TeamMember(me, true, true);

        this.appbarService.setTitle('Create a Team');
    }

    createTeam() {
        this.creating = true;
        this.teamService.writeTeam(this.summaryTeam).then((resp) => {
            this.creating = false;
            this.router.navigate(['app/teams']); 
        });
    }

    addTeamMember(user: User) {
        this.selectedTeamMembers = [
            ...this.selectedTeamMembers,
            new TeamMember(user, false, false),
        ];
        this.usersToExcludeFromUserSelector = [ 
            ...this.usersToExcludeFromUserSelector,
            user,
        ];
    }

    removeTeamMember(member: TeamMember) {
        this.selectedTeamMembers = this.selectedTeamMembers.filter(
            (selectedTeamMember => selectedTeamMember.user._id !== member.user._id)
        );
    }

    setSummaryTeam() {
        this.summaryTeam = new Team (
            this.firstFormGroup.value.NameCtrl,
            this.firstFormGroup.value.DescCtrl, 
            this.currentCreator,
            this.selectedTeamMembers,
            this.givenTeamBanner,
        );
    }

    setImage(givenFile) {
        this.givenTeamBanner = givenFile;
    }
}
