import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { List } from '../list.model';

import { AppbarService } from '../appbar.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {

  @Output() drawerCloseRequested = new EventEmitter<boolean>();

  subscription: Subscription;
  taskLists: List[] = [];
  showAddListInput = false;
  addListName: string;
  addListDisabled = false;

  constructor(private appbarService: AppbarService, private taskService: TaskService) {
    this.subscription = taskService.taskListsValid$.subscribe(
      taskListValid => {
        if (!taskListValid) {
          taskService.validateTaskListsStatus();
          this.getLists();
        }
      }
    );
  }

  ngOnInit() {
    this.getLists();
  }

  getLists() {
    this.taskService.getLists().subscribe((lists: List[]) => {
      this.taskLists = lists;
    });
  }

  requestDrawerClose() {
    this.drawerCloseRequested.emit(true);
  }

  toggleAddListInput() {
    this.showAddListInput = !this.showAddListInput;
  }

  addList() {
    this.addListDisabled = true;
    this.taskService.addList({ title: this.addListName }).subscribe(() => {
      this.taskService.invalidateTaskListsStatus();
      this.addListName = '';
      this.addListDisabled = false;
    });
  }

  changeAppTitle(event) {
    this.requestDrawerClose();
    this.appbarService.setTitle(event.target.innerText);
  }

}
