import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatBottomSheet } from '@angular/material';

import { CompletedTaskListComponent } from '../completed-task-list/completed-task-list.component';

import { List } from '../list.model';
import { Task } from '../task.model';

import { AppbarService } from '../appbar.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {

  subscription: Subscription;

  listId: string;
  quickAddTask: string;
  loading: boolean = true;
  tasks: Task[] = [];
  loadingCompletedTasks: boolean = false;
  completedTasks: Task[] = [];

  constructor(
    private appbarService: AppbarService,
    private taskService: TaskService,
    private bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private router: Router,
    ) { 
    this.subscription = taskService.taskListValid$.subscribe(
      taskListValid => {
        if (!taskListValid) {
          taskService.validateTaskListStatus();
          this.getTasks(this.listId);
        }
      }
    )
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.listId = params.get('listId');
      if (!this.listId || this.listId === 'today') {
        this.appbarService.setTitle('Today');
      }
      this.loading = true;
      this.getTasks(this.listId);
      this.taskService.getList(this.listId).subscribe((list) => {
        this.appbarService.setTitle(list.title);
      })
    });
  }
  
  getTasks(listId: string) {
    const filters = { listId: listId || 'today' };
    this.taskService.getTasks(filters).subscribe((tasks: Task[]) => {
      this.loading = false;
      this.tasks = tasks || [];
    });
  }

  addTask() {
    const newTask = <Task>{ title: this.quickAddTask };    
    if (this.listId && this.listId !== 'today') {
      newTask.listId = this.listId;
    }
    this.taskService.addTask(newTask).subscribe(() => {
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

    const filters = <any>{ completed: true };
    if (this.listId !== 'today') {
      filters.listId = this.listId;
    }
    this.taskService.getTasks(filters).subscribe((tasks: Task[]) => {
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
