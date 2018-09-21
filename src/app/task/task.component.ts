import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';

import { Task } from '../task.model';

import { RightPaneService } from '../rightpane.service';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
})

export class TaskComponent {
    @Input () task: Task;

    constructor (
        iconRegistry: MatIconRegistry, 
        sanitizer: DomSanitizer,        
        private rightPaneService: RightPaneService,
    ) { }

    openDetailPane() {
        this.rightPaneService.setTask(this.task);
        this.rightPaneService.open('detail');
    }
}
