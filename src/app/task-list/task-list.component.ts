import { Component } from '@angular/core';

import { Task } from '../task.model';

import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
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
      this.tasks = tasks.filter(task => !task.completed && !task.deleted);
    });
  }

  addTask() {
    this.taskService.createTask({ title: this.quickAddTask }).subscribe(() => {
      this.taskService.invalidateTaskListStatus(true);
      this.quickAddTask = '';
    }) 
  }

  onMarkedAsComplete(taskId: string) {
    this.taskService.completeTask(taskId).subscribe(() => {
      this.tasks = this.tasks.filter(task => task._id !== taskId);
      this.taskService.invalidateTaskListStatus(true);
    });
  }
  
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}
