import { Injectable } from '@angular/core';

import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class RightPaneService {

  opened = false;
  task: Task;
  teamId = '';
  type = '';

  constructor() { }

  open(pane: string) {
    this.opened = true;
    this.type = pane;
  }

  close() {
    this.opened = false;
    this.reset();
  }

  toggle(pane: string) {
    this.opened = !this.opened;
    this.type = this.opened ? pane : '';
  }

  setTask(task: Task, teamId: string = '') {
    this.task = task;
    this.teamId = teamId;
  }

  clearTask() {
    this.task = null;
  }

  reset() {
    this.task = null;
    this.teamId = '';
    this.type = '';
  }
}
