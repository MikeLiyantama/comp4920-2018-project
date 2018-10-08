import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from '../../user/user.model';
import { Team } from '../team.model';
import { TeamMember } from '../teammember.model';
import { TeamService } from '../team.service';

@Component ({
    selector: 'app-memfinder',
    templateUrl: './memfinder.component.html',
    styleUrls: ['./memfinder.component.css']
})

export class MemfinderComponent implements OnInit {
    myUserControl = new FormControl ();
    allUsers: User [];
    userFormGroup: FormGroup;
    filteredUsers: Observable <User[]>;
    filteredMembers: Observable <TeamMember[]>;

    constructor (private _formBuilder: FormBuilder, private teamService: TeamService) {}

    public getAllUsers () {
        this.teamService.getAllUsers().then(data => {
            if (data) {


                data.forEach (function (ref, n) {
                

                    if (!data[n].profile) {
                        data[n].profile = 'assets/0.jpg';
                    }
                    if (!data[n].bio) {
                        // set the dummy bio
                        data[n].bio = "hi";
                    }
                });
                this.allUsers = data;

                this.filteredUsers = this.myUserControl.valueChanges.pipe (
                    startWith(''),
                    map (user => user ? this._filter(user): this.allUsers.slice())
                );
            }
        });
    }

    selectMember() {

    }

    ngOnInit () {
        this.getAllUsers();
        this.userFormGroup = this._formBuilder.group({
            SearchCtrl: ['', Validators.required]
        });
    }

    private _filter (value: string): User [] {
        const filterValue = value.toLowerCase();
        return this.allUsers.filter (user => user.username.toLowerCase().indexOf(filterValue) === 0);
    }

}

