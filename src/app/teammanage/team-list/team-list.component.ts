import { Component, OnInit , Input, Inject, Injectable, InjectableProvider} from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogModule, MatDialogConfig} from '@angular/material';

import { List } from '../../list.model';

import { TeamService } from '../team.service';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {

  @Input() teamId: string;
  private lists: List[] = [];
  private loading = false;
  private inputListField: string;

  constructor(
    private teamService: TeamService,
    private taskService: TaskService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getLists();
  }

  getLists() {
    this.teamService.getTeamLists(this.teamId).subscribe((lists) => {
      this.lists = lists;
    });
  }

  createList() {
    const newList = <List>{teamID : this.teamId, title: this.inputListField};
    this.taskService.addList(newList).subscribe(() => {
      this.getLists();
      this.inputListField = '';
    });
  }
}
