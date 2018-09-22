import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

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
          taskService.validateTaskListStatus();
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
    this.taskService.addTask({ title: this.quickAddTask }).subscribe(() => {
      this.taskService.invalidateTaskListStatus();
      this.quickAddTask = '';
    }) 
  }

  onTaskMarkedAsComplete(taskId: string) {
    this.taskService.completeTask(taskId).subscribe(() => {
      this.tasks = this.tasks.filter(task => task._id !== taskId);
      this.taskService.invalidateTaskListStatus();
    });
  }

  onTaskImportanceToggled(toggledTask) {
    this.taskService.updateTaskImportance(toggledTask._id, !toggledTask.important).subscribe(() => {
      this.taskService.invalidateTaskListStatus();
    });
  }
  
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}
