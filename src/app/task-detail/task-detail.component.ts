import { Component, OnInit } from '@angular/core';

import { Task } from '../task.model';

import { RightPaneService } from '../rightpane.service';
import { TaskService } from '../task.service';
import * as moment from 'moment';

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
    {value: "daily-0", viewValue: "Daily for a week"},
    {value: "weekly-1", viewValue: "Weekly for a month"},
    {value: "monthly-2", viewValue: "Monthly for a year"}
  ]
  choice: string;
  constructor(
    private taskService: TaskService,
    private rightPaneService: RightPaneService,
  ) { }

  ngOnInit() {
  }

  async maybeSaveAndClose() {
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

  async maybeDeleteAndClose() {
    this.taskService.deleteTask(this.rightPaneService.task._id).subscribe(() => {
      this.taskService.invalidateTaskListStatus();
      this.rightPaneService.close();
    });
  }

  async copyTask() {
    this.taskService.getTask(this.rightPaneService.task._id).subscribe(res=> {
      let newTask = Object.assign({}, res);
      newTask['_id']=undefined;

      this.taskService.addTask(<Task>newTask).subscribe(res => {      
        this.taskService.invalidateTaskListStatus();

        // console.log(res);

        // console.log(newTask);
      });
    });
  }

  async repeat() {
    if (this.choice == "daily-0") {
      this.repeatDaily();
    } else if (this.choice == "weekly-1") {
      this.repeatWeekly();
    } else if (this.choice == "monthly-2") {
      this.repeatMonthly();
    } 
  }

  async repeatDaily() {
    this.taskService.getTask(this.rightPaneService.task._id).subscribe(res => {
      var i = 0;
      //change date
      const date = moment(res['dueDate']);
      while (i < 7) {
        let newTask = Object.assign({}, res);
        newTask["_id"] = undefined;
        newTask['dueDate'] = date.add(i + 1, 'day');

        this.taskService.addTask(<Task>newTask).subscribe(res => {});
          
      }
      
      this.taskService.invalidateTaskListStatus();
    });
  }

  async repeatWeekly() {
    this.taskService.getTask(this.rightPaneService.task._id).subscribe(res => {
      var i = 0;
      //change date
      const date = moment(res['dueDate']);
      while (i < 4) {
        let newTask = Object.assign({}, res);
        newTask["_id"] = undefined;
        newTask['dueDate'] = date.add(i + 1, 'week');

        this.taskService.addTask(<Task>newTask).subscribe(res => {});
          
      }
      
      this.taskService.invalidateTaskListStatus();
    });

  }

  async repeatMonthly() {
    this.taskService.getTask(this.rightPaneService.task._id).subscribe(res => {
      var i = 0;
      //change date
      const date = moment(res['dueDate']);
      while (i < 12) {
        let newTask = Object.assign({}, res);
        newTask["_id"] = undefined;
        newTask['dueDate'] = date.add(i + 1, 'month');

        this.taskService.addTask(<Task>newTask).subscribe(res => {});
          
      }
      
      this.taskService.invalidateTaskListStatus();
    });

  }
}
