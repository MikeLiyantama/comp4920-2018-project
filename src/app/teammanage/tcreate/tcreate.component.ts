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
    selector: 'app-teamcreate',
    templateUrl: './tcreate.component.html',
    styleUrls: ['./tcreate.component.css'],
    providers: [TeamService]
})

export class TeamCreateComponent implements OnInit {
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
    // Till the backend supports user selecting, use dummy data
    allUsers;
    currentUser: User;

    constructor (
        private _formBuilder: FormBuilder,
        private appbarService: AppbarService,
        private authService: AuthService,
        private teamService: TeamService,
        private userService: UserService,
        private router: Router,
    ) {}

    public getAllUsers () {
        // Set the array for all users
        this.userService.getUsers().subscribe((users) => {
            this.allUsers = users;

            // Set the current user
            const me = this.authService.getDecodedToken();
            this.currentUser = this.allUsers.find((user) => {
                return user._id == me._id;
            });
            this.currentCreator = new TeamMember(this.currentUser, true, true);

            // Set the filter for users for searching later
            this.filteredUsers = this.myControl.valueChanges.pipe(
                startWith(''),
                map (user => user ? this._filter(user) : this.allUsers.slice())
            );
        });
    }

    ngOnInit() {
        this.getAllUsers();
        this.firstFormGroup = this._formBuilder.group({
            NameCtrl: ['', Validators.required],
            DescCtrl: ['', Validators.required]
        });
        this.secondFormGroup = this._formBuilder.group({
            SearchCtrl: ['', Validators.required]
        });

        this.appbarService.setTitle('Create a Team');
    }

    private _filter (value: string): User[] {
        const filterValue = value.toLowerCase();
        return this.allUsers.filter (user => user.username.toLowerCase().indexOf(filterValue) ===0);
    }

    public routeDash () {
        this.router.navigate(['app/teams']);
    }

    createTeam() {
    this.teamService.writeTeam (this.summaryTeam).then ((resp) => {
    this.router.navigate(['app/teams']); 
    });
    }

    addTeamMember (user: User) {

        var exists = this.selectedTeamMembers.some (function (a) {
            // Switch this test later to the _id
            return a.user.username == user.username;
        });
        if (!exists) {
            this.selectedTeamMembers.push (new TeamMember (user, false, false));
        }
        this.secondFormGroup.controls["SearchCtrl"].reset();
    }

    removeTeamMember (member: TeamMember) {
        var n = this.selectedTeamMembers.indexOf (member);
        this.selectedTeamMembers.splice (n, 1);
    }

    setSummaryTeam () {
        this.summaryTeam = new Team (this.enteredTeamName, this.enteredTeamDescription, 
                        this.currentCreator, this.selectedTeamMembers, this.givenTeamBanner);
    }

    setImage (givenFile) {
        console.log ("Setting image");
        this.givenTeamBanner = givenFile; 
        if (this.givenTeamBanner) {
            console.log ("image set");
        }
    }
}
