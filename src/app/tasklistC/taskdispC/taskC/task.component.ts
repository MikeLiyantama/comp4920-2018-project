import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Task } from '../../task.model';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
})

export class TaskComponent {
    @Input () task: Task;
    @Output () deleteEmitter = new EventEmitter <Task> ();
    showOptions: boolean = false;
    taskChecked: boolean = false;

    deleteTask () {
        this.deleteEmitter.emit (this.task);
    }
}
