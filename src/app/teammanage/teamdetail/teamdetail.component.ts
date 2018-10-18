import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { interval } from "rxjs/internal/observable/interval";
import { startWith, switchMap } from "rxjs/operators";

import { Message } from '../../discussion/message/message.model';
import { Team } from '../team.model';
import { TeamMember } from '../teammember.model';
import { User } from '../../user.model';

import { AppbarService } from '../../appbar.service';
import { AuthService } from '../../auth.service';
import { MessageService } from '../../message.service';
import { TeamService } from '../team.service';

@Component({
    selector: 'app-teamdetail',
    templateUrl: './teamdetail.component.html',
    styleUrls: ['./teamdetail.component.css'],
    providers: [ TeamService ]
})


export class TeamDetailComponent implements OnInit {

    subscription: Subscription;

    team: Team;
    teamId: string;
    loading: boolean = true;
    loadingMessages: boolean = true;

    myControl = new FormControl ();
    allUsers: User[];
    currentUser;
    detailsGroup: FormGroup;
    membersGroup: FormGroup;
    usersToExcludeFromUserSelector: User[] = [];
    messages: Message[] = [];

    constructor (
        private _formBuilder: FormBuilder,
        private appbarService: AppbarService,
        private authService: AuthService,
        private messageService: MessageService,
        private teamService: TeamService,
        private route: ActivatedRoute,
    ) { 
        this.subscription = messageService.messagesValid$.subscribe(
            messagesValid => {
                if (messagesValid.teamId === this.teamId && !messagesValid.valid) {
                    messageService.validateMessagesForTeam(this.teamId);
                    this.getMessages();
                }
            }
        );
    }

    ngOnInit () {
        this.detailsGroup = this._formBuilder.group({
            NameCtrl: ['', Validators.required],
            DescCtrl: ['']
        });
        this.membersGroup = this._formBuilder.group({
            SearchCtrl: ['', Validators.required]
        });

        this.route.paramMap.subscribe((params) => {
            this.teamId = params.get('teamId');
            if (this.teamId) {
                this.teamService.getTeam(this.teamId).subscribe((team) => {
                    this.team = team;
                    this.appbarService.setTitle(team.name);
                    this.usersToExcludeFromUserSelector = [ 
                        this.authService.getDecodedToken(),
                        ...this.team.members.map(member => member.user),
                    ];
                    this.loading = false;

                    this.loadingMessages = true;
                    this.getMessages();
                });
            }
        });

        this.initMessagePolling();
    }

    initMessagePolling() {
        interval(5000)
            .pipe(
                startWith(0),
                switchMap(() => this.messageService.getMessagesForTeam(this.teamId))
            )
            .subscribe((messages) => {
                this.messages = messages;
                this.loadingMessages = false;
            });
    }

    getMessages() {
        this.messageService.getMessagesForTeam(this.teamId).subscribe((messages) => {
            this.messages = messages;
            this.loadingMessages = false;
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

    addToTeam(user) {
        const exists = this.team.members.some((member) => member.user.username == user.username);
        if (!exists) {
            this.team.members = [ ...this.team.members, (new TeamMember (user, false, false)) ];
            this.teamService.addMemberToTeam(user, this.team);
        }
    }

    removeFromTeam(event) {
        // event should be emitted member from memcard component
        var n = this.team.members.indexOf(event);
        this.team.members.splice (n, 1);
        this.teamService.removeFromTeam(event, this.team);
    }

    sendMessage(message) {
        this.messageService.sendMessageToTeam(message, this.teamId).subscribe(() => {
            this.messageService.invalidateMessagesForTeam(this.teamId);
        });
    }
}
