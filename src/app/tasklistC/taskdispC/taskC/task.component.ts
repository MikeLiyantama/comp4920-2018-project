import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Task } from '../../task.model';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html'
})

export class TaskComponent {
    @Input () task: Task;

}
