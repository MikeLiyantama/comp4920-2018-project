import { Injectable } from '@angular/core';

import { Task } from './task.model';
import { User } from './user.model';

export interface TaskExtras {
  teamId?: string;
  collaborators?: User[];  
}

export interface Options {  
  move?: boolean;
  copy?: boolean;
  repeat?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RightPaneService {

  opened = false;
  task: Task;
  teamId = '';
  canAssign = false;
  collaborators: User[];
  type = '';
  options: Options;

  constructor() { }

  open(pane: string, options: Options = null) {
    this.opened = true;
    this.type = pane;
    this.options = options;
  }

  close() {
    this.opened = false;
    this.reset();
  }

  toggle(pane: string) {
    this.opened = !this.opened;
    this.type = this.opened ? pane : '';
  }

  setTask(task: Task, extras: TaskExtras = {}) {
    this.task = task;
    this.teamId = extras.teamId;
    this.collaborators = extras.collaborators
  }

  clearTask() {
    this.task = null;
  }

  reset() {
    this.task = null;
    this.teamId = '';
    this.type = '';
    this.options = {};
  }
}
