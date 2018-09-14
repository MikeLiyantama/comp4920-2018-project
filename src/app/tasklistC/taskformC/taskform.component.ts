import { Component } from '@angular/core';
import { Task } from '../task.model';
import { Output, EventEmitter } from '@angular/core';
import { TaskService } from '../task.service';


@Component({
    selector: 'app-taskform',
    templateUrl: './taskform.component.html',
    styleUrls: ['./taskform.component.css'],
    providers: [TaskService]
})

export class TaskFormComponent {
    @Output () taskEmitter = new EventEmitter <Task>();
    nameField: string = "";
    descriptionField: string = "";
    dateField: Date;

    constructor (private taskService: TaskService) {}
    
    giveNewTask () {
        if (this.nameField && this.descriptionField) {
            var task = new Task (this.nameField, this.descriptionField);
            // Pass to controller
            this.taskEmitter.emit (task);
            this.nameField = "";
            this.descriptionField = "";
            console.log (this.dateField);
            // Write to DB here
            this.taskService.writeTask (task);
        }
    }

    clearFields () {
        this.nameField = "";
        this.descriptionField = "";
    }

}
