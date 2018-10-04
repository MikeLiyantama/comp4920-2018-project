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
    currentCreator: TeamMember;
    // Till the backend supports user selecting, use dummy data
    dummyBio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit " + 
    "Donec vitae elit aliquam, dignissim ex sed, fermentum ex. " + 
    "Ut gravida sodales sagittis. Suspendisse lacus ipsum, maximus vitae " + 
    "gravida vulputate,  varius vulputate nulla. Phasellus gravida augue ac " + 
    "justo eleifend, quis tincidunt sapien.";

    allUsers: User [] = [
        new User ('Bobby', this.dummyBio, 'assets/1.jpg'),
        new User ('Tracy', this.dummyBio, 'assets/2.jpg'),
        new User ('Kyle', this.dummyBio, 'assets/3.jpg'),
        new User ('Charles', this.dummyBio, 'assets/4.jpg'),
        new User ('Lily', this.dummyBio, 'assets/5.jpg')
    ];
    currentUser: User = new User ('Wendy', this.dummyBio, 'assets/0.jpg');

    constructor (private _formBuilder: FormBuilder, private teamService: TeamService) {}

    ngOnInit() {
        this.firstFormGroup = this._formBuilder.group({
            NameCtrl: ['', Validators.required],
            DescCtrl: ['', Validators.required]
        });
        this.secondFormGroup = this._formBuilder.group({
            SearchCtrl: ['', Validators.required]
        });
        this.filteredUsers = this.myControl.valueChanges.pipe (
            startWith(''),
            map (user => user ? this._filter(user) : this.allUsers.slice())
        );
        this.currentCreator = new TeamMember (this.currentUser, true, true);

        console.log ("test: ");
        this.teamService.getAllUsers().then(data => console.log(data));
        this.teamService.getMe ().then (data => console.log (data));
    }

    private _filter (value: string): User[] {
        const filterValue = value.toLowerCase();
        return this.allUsers.filter (user => user.username.toLowerCase().indexOf(filterValue) ===0);
    }

    createTeam() {
        console.log ("Team name: " + this.firstFormGroup.controls["NameCtrl"].value);
        console.log ("Team desc: " + this.firstFormGroup.controls["DescCtrl"].value);

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

}
