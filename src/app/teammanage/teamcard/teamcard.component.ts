import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { Team } from '../team.model';
import { TeamMember } from '../teammember.model';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component ({
    selector: 'app-teamcard',
    templateUrl: './teamcard.component.html',
    styleUrls: ['./teamcard.component.css']
})


export class TeamCardComponent implements OnInit {

    @Input() team: Team;
    @Input() showActions: true;

    // Emitter for team deletion
    @Output() teamEmitter = new EventEmitter <Team> ();
    // Emitter for team details
    @Output() detailsEmitter = new EventEmitter <Team> ();

    constructor (iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon (
            'people',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/people.svg'));
    }

    triggerRemove () {
        this.teamEmitter.emit (this.team);
    }

    triggerDetails () {
        this.detailsEmitter.emit (this.team);
    }

    ngOnInit () {
        if (this.team) {
            // Check if the team given has a banner. if not, use a default
            if (!this.team.hasOwnProperty('banner') || !this.team.banner) {
                this.team['banner'] = 'assets/defaultteam.jpg';
            }
        }
    }
}
