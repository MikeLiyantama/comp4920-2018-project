import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TeamMember } from '../teammember.model';
import { User } from '../../user.model';

@Component ({
    selector: 'app-memcard',
    templateUrl: './memcard.component.html',
    styleUrls: ['./memcard.component.css']
})

export class MemcardComponent implements OnInit {
    @Input () teamMember: TeamMember;
    @Input () creatorDisabled: boolean;
    @Input () leaderDisabled: boolean;
    @Input () removeDisabled: boolean;
    @Output () removeEmitter = new EventEmitter <TeamMember> ();

    constructor() {
    }

    ngOnInit() {
    }

    removeMember() {
        this.removeEmitter.emit (this.teamMember);
    }

    changeLeadership() {
        if (this.teamMember.isLeader) {
            this.teamMember.isLeader = false;
        } else {
            this.teamMember.isLeader = true;
        }
    }

}
