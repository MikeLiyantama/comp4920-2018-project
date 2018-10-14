import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import differenceWith from 'lodash/differenceWith';
import isEqual from 'lodash/isEqual';

import { UserService } from '../user.service';

import { User } from '../user.model';

@Component({
  selector: 'app-user-select',
  templateUrl: './user-select.component.html',
  styleUrls: ['./user-select.component.css']
})
export class UserSelectComponent implements OnInit {
  
  @Input() chips: boolean = false;
  @Output() userSelected = new EventEmitter<User>();

  private _excludedUsers: User[] = [];

  userCtrl = new FormControl();
  separatorKeysCodes = [ENTER];
  loading = true;

  users: User[] = [];
  filteredUsers: Observable<User[]>;
  selectedUsers: User[] = [];

  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;

  @Input()
  set excludedUsers(excludedUsers: User[]) {
    this._excludedUsers = [ ...this._excludedUsers, ...excludedUsers];
    this.users = differenceWith(this.users, this._excludedUsers, (a, b) => a._id === b._id);
  }

  constructor(private userService: UserService) {
    this.filteredUsers = this.userCtrl.valueChanges
      .pipe(
        startWith(null),
        map((user: string | null) => user ? this._filterUsers(user) : this.users.slice())
      );
  }
  ngOnInit() {
    console.log(this.chips);
    this._getAllUsers();
  }

  private _filterUsers(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(user => user.username.toLowerCase().indexOf(filterValue) === 0);
  }


  private _getAllUsers() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users || [];
      if (this._excludedUsers.length > 0) {
        this.users = differenceWith(this.users, this._excludedUsers, (a, b) => a._id === b._id);
      }
      this.loading = false;
    });
  }

  addUser(event: MatChipInputEvent): void {
    const value = event.value;

    // Add our fruit
    const trimmedValue = (value || '').trim();
    if (trimmedValue) {
      const user = this.users.find((user => user.username === trimmedValue));    
      if (user) {
        this.selectedUsers = [ ...this.selectedUsers, user ];
        this.userSelected.emit(user);
        this.resetInput();
      }
    }
  }

  removeUser(user: User): void {
    const index = this.selectedUsers.findIndex(element => element._id === user._id);
    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
    }
  }

  resetInput(): void {
    this.userInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }

  selectUser(event: MatAutocompleteSelectedEvent): void {
    const user = this.users.find(user => user.username === event.option.value);
    this.selectedUsers = [ 
      ...this.selectedUsers,
      user,
    ];
    this.userSelected.emit(user);
    this.resetInput();
  }

}
