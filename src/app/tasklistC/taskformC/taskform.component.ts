import { Component } from '@angular/core';
import { Task } from '../task.model';
import { Output, EventEmitter } from '@angular/core';
import { TaskService } from '../task.service';


@Component({
    selector: 'app-taskform',
    templateUrl: './taskform.component.html',
    providers: [TaskService]
})

export class TaskFormComponent {
    @Output () taskEmitter = new EventEmitter <Task>();
    nameField: string = "";
    descriptionField: string = "";

    constructor (private taskService: TaskService) {}
    
    giveNewTask () {
        if (this.nameField && this.descriptionField) {
            var task = new Task (this.nameField, this.descriptionField);
            // Pass to controller
            this.taskEmitter.emit (task);
            this.nameField = "";
            this.descriptionField = "";
            // Write to DB here
            console.log ("Writing to DB");
            this.taskService.writeTask (task);
            console.log ("Done writing to DB");
        }
    }

    clearFields () {
        this.nameField = "";
        this.descriptionField = "";
    }

}
