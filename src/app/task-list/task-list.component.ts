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
  quickAddTask: string;
  subscription: Subscription;

  constructor(private taskService: TaskService) { 
    this.subscription = taskService.taskListValid$.subscribe(
      taskListValid => {
        if (!taskListValid) {
          taskService.validateTaskListStatus(false);
          this.getTasks();
        }
      }
    )
  }

  ngOnInit() {
    this.getTasks();
  }

  async getTasks() {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks.filter((task) => !task.completed && !task.deleted);
    });
  }

  addTask() {
    this.taskService.createTask({ title: this.quickAddTask }).subscribe(() => {    
      this.taskService.invalidateTaskListStatus(true);
      this.quickAddTask = '';
    }) 
  }
  
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}
