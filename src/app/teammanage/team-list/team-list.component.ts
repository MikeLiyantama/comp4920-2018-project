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
  private inputListField : string;

  constructor(
    private teamTaskService : TeamTasksService
  ) { }

  ngOnInit(
    
  ) {
    this.getList();
  }

  getList(){
    let thisC = this;
    this.teamTaskService.getList(this.teamId)
        .subscribe(function(res){
            thisC.lists = res;
            console.log("YEAH BOY LOADED")
        })
  }

  createList(){
    let thisC = this;
    const newList = <List>{teamID : this.teamId, title: this.inputListField}
    this.teamTaskService.createList(newList)
        .subscribe(function(res){
          thisC.inputListField = '';
        })
  }
}
