import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit, OnChanges } from '@angular/core';
import { Task } from '../task.model';
import { TaskService } from '../task.service';


@Component({
    selector: 'app-taskdisplay',
    templateUrl: './taskdisplay.component.html',
    providers: [TaskService]
})

export class TaskDisplayComponent implements OnInit {
    // Populate this array from the DB for that user   
    // Chucking garbage in for now 
    tasks = [];    
    @Input() receivedTask: Task;
    @Input() toRemove: Task;

    constructor (private taskService: TaskService) {}

    ngOnInit() {
        this.taskService
            .getTasks()
            .then ((tasks: Task []) => {
                this.tasks = tasks;
            });
    }

    ngOnChanges (changes) {
        for (let property in changes) {
            if (property === "receivedTask") {
                if (this.receivedTask) {
                    this.tasks.push (this.receivedTask);
                    this.receivedTask = null;
                }
            } else {
                console.log (property);
            }
        }
    }

    // Note for later: removed != completed. 
    removeTask (task : Task) {
        var n = this.tasks.indexOf (task);
        this.tasks.splice(n, 1);
        // delete from db
    }
    
}
