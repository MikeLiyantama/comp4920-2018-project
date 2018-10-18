import { Component } from '@angular/core';
import { Team } from '../team.model';
import { TeamMember } from '../teammember.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith  } from 'rxjs/operators';
import { User } from '../../user.model';
import { TeamService } from '../team.service';

@Component({
    selector: 'app-tmanager',
    templateUrl: './tmanager.component.html',
    styleUrls: ['./tmanager.component.css'],
    providers: [TeamService]
})

export class TeamManagementComponent {
}
