import { Component, OnInit , Input, Inject, Injectable, InjectableProvider} from '@angular/core';
import { TeamTasksService } from '../../team-tasks.service'
import { MatDialog, MatDialogRef, MatDialogModule, MatDialogConfig} from '@angular/material'
import { List } from '../../list.model'
import {TeamTasksComponent} from '../team-tasks/team-tasks.component'

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
    private teamTaskService : TeamTasksService,
    private teamTask : TeamTasksComponent,
    private dialog: MatDialog
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
          console.log("YEAH BOY");
          thisC.inputListField = '';
        })
  }

  expandList(listId){
    let dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '99%';
    dialogConfig.height = '99%';
    dialogConfig.data = {
       teamId: this.teamId,
       listId: listId
    };
    const dialog = this.dialog.open(TeamTasksComponent, dialogConfig);
    dialog.afterClosed().subscribe(function(res){
      console.log(res);//DEBUG
    })
  }
}
