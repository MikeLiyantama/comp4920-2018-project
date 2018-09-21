import { Component, OnInit } from '@angular/core';

import { Task } from '../task.model';

import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  subscription: Subscription;

  constructor(private taskService: TaskService) { 
    this.subscription = taskService.taskEdited$.subscribe(
      taskEdited => {
        if (taskEdited) {
          taskService.changeTaskEditedStatus(false);
          this.getTasks();
        }
      }
    )
  }

  ngOnInit() {
    this.getTasks();
  }

  async getTasks() {
    const tasks = await this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks.filter((task) => !task.completed && !task.deleted);
    });
  }
  
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}
