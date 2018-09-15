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
    tasks = [];    
    checkedTasks = [];
    numCheckedTasks = 0;
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

    checkGivenTask (task: Task) {
        this.checkedTasks.push (task);
        ++ this.numCheckedTasks;
        if (this.numCheckedTasks == 1) {
            // snack

        }
    }

    uncheckGivenTask (task: Task) {
        var n = this.checkedTasks.indexOf (task);
        this.checkedTasks.splice (n, 1);
        --this.numCheckedTasks;
    }

    // Note for later: removed != completed. 
    removeTask (task : Task) {
        var n = this.tasks.indexOf (task);
        this.tasks.splice(n, 1);
        // delete from db
    }

    saveTaskEdits (task: Task) {
        console.log ("The received task from the child:");
        console.log (task);
        console.log ("The id is:");
        //console.log (task._id);
        this.taskService.editTask (task);

    }

    completeCheckedTasks () {
        

    }
    
}

