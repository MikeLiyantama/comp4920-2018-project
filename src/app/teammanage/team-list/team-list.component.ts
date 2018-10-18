import { Component, OnInit , Input} from '@angular/core';
import { TeamTasksService } from '../../team-tasks.service'
import { List } from '../../list.model'

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  @Input() teamId : String;
  private lists : List[] = [];
  private loading : boolean = false;

  constructor(
    private teamTaskService : TeamTasksService
  ) { }

  ngOnInit(
    
  ) {

  }

}
