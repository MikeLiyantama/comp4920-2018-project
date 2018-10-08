import { Component, OnInit } from '@angular/core';
import { Team } from '../team.model';
import { TeamMember } from '../teammember.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith  } from 'rxjs/operators';
import { User } from '../../user/user.model';
import { TeamService } from '../team.service';

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

    constructor (private _formBuilder: FormBuilder, private teamService: TeamService) {}

    public getAllUsers () {
        // Set the array for all users
        this.teamService.getAllUsers().then (data => {
            if (data) {
                data.forEach (function (ref, n) {
                    var dummyBio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit " + 
                    "Donec vitae elit aliquam, dignissim ex sed, fermentum ex. " + 
                    "Ut gravida sodales sagittis. Suspendisse lacus ipsum, maximus vitae " + 
                    "gravida vulputate,  varius vulputate nulla. Phasellus gravida augue ac " + 
                    "justo eleifend, quis tincidunt sapien.";
                    if (!data[n].profile) {
                        data[n].profile = 'assets/0.jpg';
                    }
                    if (!data[n].bio) {
                        data[n].bio = dummyBio;
                    }
                });
                this.allUsers = data;

                // Set the current user
                this.teamService.getMe().then (idObj => {
                    if (idObj) {
                        this.currentUser = this.allUsers.find (function (user) {
                            return user._id == idObj.currUser;
                        });
                        this.currentCreator = new TeamMember (this.currentUser, true, true);
                    }
                });
                // Set the filter for users for searching later
                this.filteredUsers = this.myControl.valueChanges.pipe (
                    startWith(''),
                    map (user => user ? this._filter(user) : this.allUsers.slice())
                );
            }
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


    }

    private _filter (value: string): User[] {
        const filterValue = value.toLowerCase();
        return this.allUsers.filter (user => user.username.toLowerCase().indexOf(filterValue) ===0);
    }

    createTeam() {
    console.log ("creating team");
    this.teamService.writeTeam (this.summaryTeam);
    console.log ("done creating team");
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
