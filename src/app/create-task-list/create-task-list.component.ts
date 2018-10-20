import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AppbarService } from '../appbar.service';
import { AuthService } from '../auth.service';
import { TaskService } from '../task.service';

import { User } from '../user.model';

@Component({
  selector: 'app-create-task-list',
  templateUrl: './create-task-list.component.html',
  styleUrls: ['./create-task-list.component.css']
})
export class CreateTaskListComponent implements OnInit {

  detailsFormGroup: FormGroup;
  collaborators: User[] = [];
  usersToExcludeFromUserSelector: User[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private appbarService: AppbarService,
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router,
  ) {
    this.usersToExcludeFromUserSelector = [ authService.getDecodedToken() ];
  }

  ngOnInit() {
    this.detailsFormGroup = this._formBuilder.group({
      listName: ['', Validators.required]
    });

    this.appbarService.setTitle('Create a List');
  }

  onUserSelected(user: User) {
    this.collaborators = [ ...this.collaborators, user ];
    this.usersToExcludeFromUserSelector = [
      ...this.usersToExcludeFromUserSelector,
      ...this.collaborators,
    ];
  }

  addList() {
    this.taskService.addList({
      title: this.detailsFormGroup.value.listName,
      collaborators: this.collaborators.map(user => user._id),
    }).subscribe((newList) => {
      this.router.navigate([`/app/lists/${newList._id}`]);
    });
  }
}
