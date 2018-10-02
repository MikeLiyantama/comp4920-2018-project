import { Component } from '@angular/core';
import { Task } from '../task.model';
import { Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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
    importanceField: string;
    importanceLevels = ["Low", "Medium", "High"];
    control = new FormControl ('', [Validators.required]);

    constructor (private taskService: TaskService) {}
    
    giveNewTask () {
        if (this.nameField) {
            console.log ("Creating a new task with importance: " + this.importanceField);
            var task = new Task (this.nameField, this.descriptionField, this.dateField, this.importanceField);
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

    formatLabel (value) {
        return value + " importance";
    }

    getErrorMessage () {
        return this.control.hasError ('required') ? 'You must enter a value':'';
    }

}
