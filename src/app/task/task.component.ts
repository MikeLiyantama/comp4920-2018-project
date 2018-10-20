import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';

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
    @Input() teamId: string;
    @Output() markedAsComplete = new EventEmitter<string>();
    @Output() markedAsIncomplete = new EventEmitter<string>();
    @Output() toggledImportance = new EventEmitter<Task>();

    completed = false;
    formattedDueDate = '';
    isNearDueDate = false;
    isPastDueDate = false;
    important = false;
    importantIcon = 'star_outline';

    constructor (
        private rightPaneService: RightPaneService,
        private taskService: TaskService,
    ) {
    }

    ngOnInit() {
        this.completed = !!this.task.completed;
        this.important = !!this.task.important;

        if (this.task.dueDate) {
            this.formattedDueDate = moment(this.task.dueDate).format('DD-MM-YYYY');
            this.isPastDueDate = moment(this.task.dueDate).isSameOrBefore(moment());
            if (!this.isPastDueDate) {
                this.isNearDueDate = moment(this.task.dueDate).diff(moment(), 'days') <= 7;
            }
        }
    }

    openDetailPane() {
        this.rightPaneService.setTask(this.task, this.teamId);
        this.rightPaneService.open('detail');
    }

    toggleTaskCompleted(event) {
        if (event.checked) {
            this.completed = true;
            this.markedAsComplete.emit(this.task._id);
        } else {
            this.completed = false;
            this.markedAsIncomplete.emit(this.task._id);
        }
    }

    toggleTaskImportance(event) {
        event.stopPropagation();
        this.important = !this.important;
        this.toggledImportance.emit(this.task);
    }
}
