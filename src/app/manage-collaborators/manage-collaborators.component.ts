import { Component, ChangeDetectorRef, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';

import { TaskService } from '../task.service';

import { User } from '../user.model';

@Component({
  selector: 'app-manage-collaborators',
  templateUrl: './manage-collaborators.component.html',
  styleUrls: ['./manage-collaborators.component.css']
})
export class ManageCollaboratorsComponent implements OnInit {

  usersToExcludeFromUserSelector: User[];

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private changeDetectorRef: ChangeDetectorRef,
    private taskService: TaskService,
  ) {
    this.usersToExcludeFromUserSelector = this.data.collaborators;
  }

  ngOnInit() {
  }

  onUserSelected(user) {
    this.taskService.addUserToList(this.data.listId, user._id).subscribe(() => {
      this.data.collaborators = [
        ...this.data.collaborators,
        user,
      ];
      this.changeDetectorRef.markForCheck();
    });
  }

  removeCollaborator(collaboratorIdToRemove) {    
    this.taskService.removeUserFromList(this.data.listId, collaboratorIdToRemove).subscribe(() => {
      this.data.collaborators = this.data.collaborators.filter(collaborator => 
        collaborator._id !== collaboratorIdToRemove
      );
      this.changeDetectorRef.markForCheck();
    });
  }

}
