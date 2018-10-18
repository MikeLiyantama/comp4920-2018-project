import { Component, OnInit, Inject , Injectable} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material';
@Component({
  selector: 'app-team-tasks',
  templateUrl: './team-tasks.component.html',
  styleUrls: ['./team-tasks.component.css']
})
@Injectable({
  providedIn: 'root'
}

)

export class TeamTasksComponent implements OnInit {
  private teamId : string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any
  ) { 
    this.teamId = data.teamId;
  }

  ngOnInit() {
  }

}
