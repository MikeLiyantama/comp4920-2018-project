import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TeamMember } from '../teammember.model';
import { User } from '../../user/user.model';

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

    ngOnInit () {
        if (!this.teamMember.user.profile) {
            this.teamMember.user.profile = 'assets/0.jpg';
        }
    }

    removeMember () {
        this.removeEmitter.emit (this.teamMember);
    }

    changeLeadership () {
        if (this.teamMember.isLeader) {
            this.teamMember.isLeader = false;
        } else {
            this.teamMember.isLeader = true;
        }
    }

}
