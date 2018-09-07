import { Component } from '@angular/core';
import { Task } from '../task.model';
import { Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-taskform',
    templateUrl: './taskform.component.html'
})

export class TaskFormComponent {
    @Output () taskEmitter = new EventEmitter <Task>();
    taskField: string;
    descriptionField: string;

}
