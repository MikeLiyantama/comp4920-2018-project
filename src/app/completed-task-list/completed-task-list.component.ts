import { Component, ChangeDetectorRef, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';

import { TaskService } from '../task.service';

@Component({
  selector: 'app-completed-task-list',
  templateUrl: './completed-task-list.component.html',
  styleUrls: ['./completed-task-list.component.css']
})
export class CompletedTaskListComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private changeDetectorRef: ChangeDetectorRef,
    private taskService: TaskService,
  ) { }

  ngOnInit() {
  }

  onTaskMarkedAsIncomplete(taskId: string) {
    this.taskService.uncompleteTask(taskId).subscribe(() => {
      this.data.completedTasks = this.data.completedTasks.filter(task => task._id !== taskId);
      this.changeDetectorRef.markForCheck();
      this.taskService.invalidateTaskListStatus();
    });
  }

}
