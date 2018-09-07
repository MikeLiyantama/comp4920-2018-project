import { Component } from '@angular/core';
import { Task } from './task.model';

@Component({
    selector: 'app-taskcontrol',
    templateUrl: './taskcontrol.component.html'
})

export class TaskControlComponent {
    showCurTasks: boolean = true;
    showTaskForm: boolean = false;
    
    switchToCurTasks () {
        this.showCurTasks = true;
        this.showTaskForm = false;
    }

    switchToTaskForm () {
        this.showCurTasks = false;
        this.showTaskForm = true;
    }
}
