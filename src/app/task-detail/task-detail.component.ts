import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';

import { List } from '../list.model';
import { Task } from '../task.model';

import { RightPaneService } from '../rightpane.service';
import { TaskService } from '../task.service';
import { TeamService } from '../teammanage/team.service';

export interface Option {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {

  title: string;
  description: string;
  dueDate: string;
  isChecked: boolean;
  options: Option[] = [
    { value: 'daily', viewValue: 'Daily for a week' },
    { value: 'weekly', viewValue: 'Weekly for a month' },
    { value: 'monthly', viewValue: 'Monthly for a year' }
  ];
  repeatChoice: string;

  constructor(
    public dialog: MatDialog,
    private taskService: TaskService,
    private rightPaneService: RightPaneService,
  ) { }

  ngOnInit() {
  }

  maybeSaveAndClose() {
    const editedTask = {
      _id: this.rightPaneService.task._id,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
    };
    if (this.title || this.description || this.dueDate) {
      this.taskService.editTask(editedTask).subscribe(() => {
        this.taskService.invalidateTaskListStatus();
        this.rightPaneService.close();
      });
    } else {
      this.rightPaneService.close();
    }
  }

  maybeDeleteAndClose() {
    this.taskService.deleteTask(this.rightPaneService.task._id).subscribe(() => {
      this.taskService.invalidateTaskListStatus();
      this.rightPaneService.close();
    });
  }

  openMoveTaskDialog(): void {
    const data = { 
      currentListId: this.rightPaneService.task.listId,
      taskId: this.rightPaneService.task._id,
      teamId: this.rightPaneService.teamId || '', 
    };

    const dialogRef = this.dialog.open(MoveTaskDialogComponent, { data, width: '200px' });

    dialogRef.afterClosed().subscribe(result => {      
      this.taskService.invalidateTaskListStatus();
    });
  }

  copyTask() {
    const newTask = {
      ...this.rightPaneService.task,
      _id: undefined,
    };
    this.taskService.addTask(newTask).subscribe(() => {
      this.taskService.invalidateTaskListStatus();
    });
  }

  repeat() {
    const dueDate = moment(this.rightPaneService.task.dueDate);
    if (dueDate) {
      let observables = [];
      if (this.repeatChoice === 'daily') {
        let i = 0;
        while (i < 7) {
          const newTask = {
            ...this.rightPaneService.task,
            _id: undefined,
            dueDate: moment.utc(dueDate.add(1, 'day')).format(),
          };
          observables = [ ...observables, this.taskService.addTask(newTask) ];
          i += 1;
        }
      } else if (this.repeatChoice === 'weekly') {
        let i = 0;
        while (i < 4) {
          const newTask = {
            ...this.rightPaneService.task,
            _id: undefined,
            dueDate: moment.utc(dueDate.add(1, 'week')).format(),
          };
          observables = [ ...observables, this.taskService.addTask(newTask) ];
          i += 1;
        }
      } else if (this.repeatChoice === 'monthly') {
        let i = 0;
        while (i < 12) {
          const newTask = {
            ...this.rightPaneService.task,
            _id: undefined,
            dueDate: moment.utc(dueDate.add(1, 'month')).format(),
          };
          observables = [ ...observables, this.taskService.addTask(newTask) ];
          i += 1;
        }
      }

      if (observables.length > 0) {
        forkJoin(observables).subscribe(() => { this.taskService.invalidateTaskListStatus(); });
      }
    }
  }
}

export interface DialogData {
  currentListId: string;
  taskId: string;
  teamId: string;
}

@Component({
  selector: 'app-move-task-dialog',
  templateUrl: 'move-task-dialog.component.html',
})
export class MoveTaskDialogComponent {

  loading = true;
  lists: List[] = [];

  constructor(
    public dialogRef: MatDialogRef<MoveTaskDialogComponent>,
    private taskService: TaskService,
    private teamService: TeamService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {

  }

  ngOnInit() {
    if (this.data.teamId === '') {      
      this.taskService.getLists().subscribe((lists) => {
        this.lists = lists;
        this.loading = false;
      });
    } else {     
      this.teamService.getTeamLists(this.data.teamId).subscribe((lists) => {
        this.lists = lists.filter(list => list._id !== this.data.currentListId);
        this.loading = false;
      });
    }
  }

  onListClick(listId: string) {
    this.loading = true;
    this.taskService.moveTaskToList(this.data.taskId, this.data.currentListId).subscribe(() => {
      this.dialogRef.close();
    });
  }
}