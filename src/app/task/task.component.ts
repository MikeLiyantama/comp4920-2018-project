import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Task } from '../task.model';

import { RightPaneService } from '../rightpane.service';
import { TaskService } from '../task.service';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
})

export class TaskComponent {
    @Input() task: Task;
    @Output() markedAsComplete = new EventEmitter<string>();
    @Output() toggledImportance = new EventEmitter<Task>();
    importantIcon: string = 'star_outline';
    completed: boolean = false;

    constructor (    
        private rightPaneService: RightPaneService,
        private taskService: TaskService,
    ) { }

    openDetailPane() {
        this.rightPaneService.setTask(this.task);
        this.rightPaneService.open('detail');
    }

    completeTask() {
        this.completed = true;
        this.markedAsComplete.emit(this.task._id);
    }

    toggleTaskImportance(event) {
        event.stopPropagation();
        this.toggledImportance.emit(this.task);
    }
}
