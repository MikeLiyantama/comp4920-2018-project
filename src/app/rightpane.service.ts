import { Injectable } from '@angular/core';

import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class RightPaneService {

  opened = false;
  task: Task;
  type = '';

  constructor() { }

  open(pane: string) {
    this.opened = true;
    this.type = pane;
  }

  close() {
    this.opened = false;
    this.type = '';
  }

  toggle(pane: string) {
    this.opened = !this.opened;
    this.type = this.opened ? pane : '';
  }

  setTask(task: Task) {
    this.task = task;
  }

  clearTask() {
    this.task = null;
  }
}
