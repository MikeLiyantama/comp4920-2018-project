import { Component } from '@angular/core';
import { Task } from '../task.model';
import { Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-taskform',
    templateUrl: './taskform.component.html'
})

export class TaskFormComponent {
    @Output () taskEmitter = new EventEmitter <Task>();
    nameField: string = "";
    descriptionField: string = "";

    
    giveNewTask () {
        if (this.nameField && this.descriptionField) {
            var task = new Task (this.nameField, this.descriptionField);
            // Pass to controller
            this.taskEmitter.emit (task);
            this.nameField = "";
            this.descriptionField = "";
            // Write to DB here
        }
    }

}
