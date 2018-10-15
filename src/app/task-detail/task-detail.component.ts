import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { Task } from '../task.model';

import { RightPaneService } from '../rightpane.service';
import { TaskService } from '../task.service';

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
    { value: "daily", viewValue: "Daily for a week" },
    { value: "weekly", viewValue: "Weekly for a month" },
    { value: "monthly", viewValue: "Monthly for a year" }
  ]
  repeatChoice: string;
  
  constructor(
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
      if (this.repeatChoice === "daily") {
        let i = 0;
        while (i < 7) {
          const newTask = { 
            ...this.rightPaneService.task,
            _id: undefined,
            dueDate: moment.utc(dueDate.add(i + 1, 'day')).format(),
          }
          this.taskService.addTask(newTask).subscribe(() => {});     
          i += 1;
        }
      } else if (this.repeatChoice === "weekly") {
        let i = 0;
        while (i < 4) {
          const newTask = { 
            ...this.rightPaneService.task,
            _id: undefined,
            dueDate: moment.utc(dueDate.add(i + 1, 'week')).format(),
          }
          this.taskService.addTask(newTask).subscribe(() => {});    
          i += 1;
        }
      } else if (this.repeatChoice === "monthly") {
        let i = 0;
        while (i < 12) {
          const newTask = { 
            ...this.rightPaneService.task,
            _id: undefined,
            dueDate: moment.utc(dueDate.add(i + 1, 'month')).format(),
          }
          this.taskService.addTask(newTask).subscribe(() => {});   
          i += 1;  
        }
      }
      this.taskService.invalidateTaskListStatus();
    }
  }
}
