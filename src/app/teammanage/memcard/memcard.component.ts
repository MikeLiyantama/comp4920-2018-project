import { Component, Input, Output } from '@angular/core';
import { TeamMember } from '../teammember.model';
import { User } from '../../user/user.model';

@Component ({
    selector: 'app-memcard',
    templateUrl: './memcard.component.html',
    styleUrls: ['./memcard.component.css']
})

export class MemcardComponent {
    @Input () teamMember: TeamMember;
    @Input () creatorDisabled: boolean;
    @Input () leaderDisabled: boolean;
    @Input () removeDisabled: boolean;
    dummyBio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit " + 
    "Donec vitae elit aliquam, dignissim ex sed, fermentum ex. " + 
    "Ut gravida sodales sagittis. Suspendisse lacus ipsum, maximus vitae " + 
    "gravida vulputate,  varius vulputate nulla. Phasellus gravida augue ac " + 
    "justo eleifend, quis tincidunt sapien.";

}
