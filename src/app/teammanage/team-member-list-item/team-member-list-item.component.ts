import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { TeamMember } from '../teammember.model';
import { User } from '../../user.model';

@Component ({
    selector: 'app-team-member-list-item',
    templateUrl: './team-member-list-item.component.html',
    styleUrls: ['./team-member-list-item.component.css']
})

export class TeamMemberListItemComponent implements OnInit {
    
    @Input() teamMember: TeamMember;
    @Input() creatorDisabled: boolean;
    @Input() leaderDisabled: boolean;
    @Input() removeDisabled: boolean;

    @Output() removeEmitter = new EventEmitter<TeamMember>();
    @Output() addedLeader = new EventEmitter<TeamMember>();
    @Output() removedLeader = new EventEmitter<TeamMember>();

    constructor() {
    }

    ngOnInit() {
    }

    removeMember() {
        this.removeEmitter.emit(this.teamMember);
    }

    changeLeadership() {
        if (this.teamMember.isLeader) {
            this.teamMember.isLeader = false;
            this.removedLeader.emit(this.teamMember);
        } else {
            this.teamMember.isLeader = true;
            this.addedLeader.emit(this.teamMember);
        }
    }

}
