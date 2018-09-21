import { Component, OnInit } from '@angular/core';

import { Task } from '../task.model';

import { RightPaneService } from '../rightpane.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  
  title: string;
  description: string;
  dueDate: string;

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
        this.taskService.invalidateTaskListStatus(true);
        this.rightPaneService.close();
      });
    } else {
      this.rightPaneService.close();
    }
  }

  async maybeDeleteAndClose() {
    this.taskService.deleteTask(this.rightPaneService.task._id).subscribe(() => {
      this.taskService.invalidateTaskListStatus(true);
      this.rightPaneService.close();
    });
  }

}
