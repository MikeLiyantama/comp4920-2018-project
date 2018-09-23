import { Component, OnInit } from '@angular/core';
import { Team } from '../team.model';
import { TeamMember } from '../teammember.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith  } from 'rxjs/operators';
import { User } from '../../user/user.model';

@Component({
    selector: 'app-teamcreate',
    templateUrl: './tcreate.component.html',
    styleUrls: ['./tcreate.component.css']
})

export class TeamCreateComponent implements OnInit {
    myControl = new FormControl (); 
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    filteredUsers: Observable <User[]>;
    selectedTeamMembers: TeamMember [] = [];

    // Till the backend supports user selecting, use dummy data
    allUsers: User [] = [
        new User ('Bobby', 'assets/1.jpg'),
        new User ('Tracy', 'assets/2.jpg'),
        new User ('Kyle', 'assets/3.jpg'),
        new User ('Charles', 'assets/4.jpg'),
        new User ('Lily', 'assets/5.jpg')
    ];
    currentUser: User = new User ('Wendy', 'assets/0.jpg');
    currentCreator: TeamMember;
    dummyBio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit " + 
    "Donec vitae elit aliquam, dignissim ex sed, fermentum ex. " + 
    "Ut gravida sodales sagittis. Suspendisse lacus ipsum, maximus vitae " + 
    "gravida vulputate,  varius vulputate nulla. Phasellus gravida augue ac " + 
    "justo eleifend, quis tincidunt sapien.";

    constructor (private _formBuilder: FormBuilder) {}

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
        this.selectedTeamMembers.push (new TeamMember (user, false, false));
        this.secondFormGroup.controls["SearchCtrl"].reset();
    }

}
