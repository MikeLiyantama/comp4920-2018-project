import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit, OnChanges } from '@angular/core';
import { Task } from '../task.model';
import { TaskService } from '../task.service';
import { MatSnackBar } from '@angular/material';


@Component({
    selector: 'app-taskdisplay',
    templateUrl: './taskdisplay.component.html',
    providers: [TaskService]
})

export class TaskDisplayComponent implements OnInit {
    tasks = [];    
    checkedTasks = [];
    completedTasks = [];
    deletedTasks = [];
    numCheckedTasks = 0;
    @Input() receivedTask: Task;
    @Input() toRemove: Task;

    constructor (private taskService: TaskService) {}

    ngOnInit() {
        this.taskService
            .getTasks()
            .then ((tasks: Task []) => {
                //this.tasks = tasks;
                // Post processing the query till backend allows for selection
                // for non-completed and non-deleted tasks
                for (let dbTask of tasks) {
                    if (dbTask.completed) {
                        this.completedTasks.push (dbTask)
                    } else if (dbTask.deleted) {
                        this.deletedTasks.push (dbTask)
                    } else {
                        this.tasks.push (dbTask);
                    }
                }
            });
        console.log ("Tasks to render:");
        console.log (this.tasks);
        console.log ("Tasks deleted: ");
        console.log (this.deletedTasks);
        console.log ("Tasks completed: ");
        console.log (this.completedTasks);
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
        // deleted property set by child component already
        var n = this.tasks.indexOf (task);
        this.tasks.splice(n, 1);
        // maintain invariant that deleted array contains all deleted tasks
        this.deletedTasks.push (task);
        // delete from db
        this.taskService.editTask (task);
    }

    saveTaskEdits (task) {
        console.log ("The received task from the child:");
        console.log (task);
        console.log ("The id is:");
        //console.log (task._id);
        this.taskService.editTask (task);

    }

    completeCheckedTasks () {
        for (let checkedT of this.checkedTasks) {
            checkedT.completed = true;
            this.completedTasks.push (checkedT);
            var n = this.tasks.indexOf (checkedT);
            this.tasks.splice (n, 1);
            this.taskService.editTask (checkedT);
        }
        this.checkedTasks = [];
        this.numCheckedTasks = 0;
    }
    
}

