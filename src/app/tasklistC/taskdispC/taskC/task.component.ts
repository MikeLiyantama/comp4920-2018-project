import { Component, OnInit, OnChanges } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Task } from '../../task.model';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
})

export class TaskComponent {
    @Input () task: Task;
    @Output () deleteEmitter = new EventEmitter <Task> ();
    @Output () checkedEmitter = new EventEmitter <Task> ();
    @Output () uncheckedEmitter = new EventEmitter <Task> ();
    @Output () editedEmitter = new EventEmitter <Task> ();
    @ViewChild ('formTitle') formTitle;
    @ViewChild ('formDescription') formDescription;
    @ViewChild ('formDate') formDate;
    formImportance;
    importanceLevels = ["Low", "Medium", "High"];
    showOptions: boolean = false;
    taskChecked: boolean = false;

    constructor (iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon (
            'done',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/done.svg'));
        iconRegistry.addSvgIcon (
            'clear',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/clear.svg'));
    }

    ngOnChanges () {
        this.formImportance = this.task.importance;

    }

    deleteTask () {
        this.task.deleted = true;
        this.deleteEmitter.emit (this.task);
    }

    toggleCheck () {
        if (this.taskChecked) {
            this.checkedEmitter.emit (this.task);
        } else {
            this.uncheckedEmitter.emit (this.task);
        }
    }

    saveEdit () {
        this.task.title = this.formTitle.nativeElement.value;
        this.task.description = this.formDescription.nativeElement.value;
        this.task.dueDate = this.formDate;
        this.task.importance = this.formImportance;
        this.editedEmitter.emit (this.task);
    }
}
