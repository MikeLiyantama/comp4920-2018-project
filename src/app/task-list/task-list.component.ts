import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatBottomSheet } from '@angular/material';

import { CompletedTaskListComponent } from '../completed-task-list/completed-task-list.component';
import { ManageCollaboratorsComponent } from '../manage-collaborators/manage-collaborators.component';

import { List } from '../list.model';
import { Task } from '../task.model';

import { AppbarService } from '../appbar.service';
import { AuthService } from '../auth.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {

  subscription: Subscription;

  @Input() listId: string;
  @Input() teamId: string;
  list: List;
  quickAddTask: string;
  loading = true;
  tasks: Task[] = [];
  loadingCompletedTasks = false;
  completedTasks: Task[] = [];
  showCollaborationButton = false;
  collaborationPanelTitle = '';
  @Input() isTeam: boolean;

  constructor(
    private authService: AuthService,
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
    );
  }

  ngOnInit() {
      this.route.paramMap.subscribe((params) => {
        this.listId = params.get('listId');
        this.loading = true;

        if (!this.listId || this.listId === 'today') {
          this.appbarService.setTitle('Today');
          this.getTasks(this.listId, true);
        } else {
          this.getTasks(this.listId, false);
          this.taskService.getList(this.listId).subscribe((list) => {
            this.loading = false;
            this.list = list;
            this.appbarService.setTitle(list.title);

            const authedUser = this.authService.getDecodedToken();
            this.showCollaborationButton = this.list.createdBy._id === authedUser._id;
            this.collaborationPanelTitle = this.list.collaborators && this.list.collaborators.length > 0
              ? 'Manage Collaboration'
              : 'Add Collaborators';
          });
        }
      });
  }

  getTasks(listId: string, setLoading?: boolean) {
    const filters = { listId: listId || 'today' };
    this.taskService.getTasks(filters).subscribe((tasks: Task[]) => {
      this.tasks = tasks || [];
      if (setLoading) {
        this.loading = false;
      }
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
    });
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

    const filters = { completed: true, listId: this.listId || 'today' };
    this.taskService.getTasks(filters).subscribe((tasks: Task[]) => {
      this.loadingCompletedTasks = false;
      this.bottomSheet.open(CompletedTaskListComponent, {
        data: { completedTasks: tasks },
      });
    });
  }

  openCollaborationDialog() {
    this.bottomSheet.open(ManageCollaboratorsComponent, {
      data: {
        collaborators: this.list.collaborators || [],
        createdBy: this.list.createdBy,
        listId: this.listId,
        title: this.collaborationPanelTitle,
      },
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
