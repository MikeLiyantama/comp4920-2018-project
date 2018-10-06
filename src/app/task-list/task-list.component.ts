import { Component } from '@angular/core';
import { Subscription } from 'rxjs';


import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatBottomSheet } from '@angular/material';

import { CompletedTaskListComponent } from '../completed-task-list/completed-task-list.component';

import { Task } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {

  subscription: Subscription;
  quickAddTask: string;
  loading: boolean = true;
  tasks: Task[] = [];
  loadingCompletedTasks: boolean = false;
  completedTasks: Task[] = [];

  constructor(private taskService: TaskService, private bottomSheet: MatBottomSheet) { 
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
      this.loading = false;
      this.tasks = tasks;
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

  openCompletedTasks() {
    this.loadingCompletedTasks = true;
    this.taskService.getTasks({ completed: true }).subscribe((tasks: Task[]) => {
      this.loadingCompletedTasks = false;
      this.bottomSheet.open(CompletedTaskListComponent, {
        data: { completedTasks: tasks },
      });
    });
  }

  taskDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    const movedTask = this.tasks[event.currentIndex];
    
    const taskBefore = this.tasks[event.currentIndex - 1];
    const taskAfter = this.tasks[event.currentIndex + 1];
    const taskBeforeDate = taskBefore ? Date.parse(taskBefore.orderDate) : null;
    const taskAfterDate = taskAfter ? Date.parse(taskAfter.orderDate) : null;

    let newOrderDate;
    if (taskBeforeDate && !taskAfterDate) {
      // bottom of the list
      newOrderDate = (new Date(taskBeforeDate - 1));
    } else if (taskAfterDate) {
      // everywhere else (top of the list, or anywhere in the middle)
      newOrderDate = (new Date(taskAfterDate + 1));
    }
    this.taskService.updateTaskOrderDate(movedTask._id, newOrderDate).subscribe(() => {
      this.taskService.invalidateTaskListStatus();
    });
  }
  
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}
