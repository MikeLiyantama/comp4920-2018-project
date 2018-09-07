import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit, OnChanges } from '@angular/core';
import { Task } from '../task.model';


@Component({
    selector: 'app-taskdisplay',
    templateUrl: './taskdisplay.component.html'
})

export class TaskDisplayComponent implements OnInit {
    // Populate this array from the DB for that user   
    // Chucking garbage in for now 
    tasks = [];    
    @Input() receivedTask: Task;
    @Input() toRemove: Task;

    ngOnInit() {
        this.tasks.push (new Task ("Walk dog", 
            "Fido has been waiting for a little while. Lets go to the park."));
        this.tasks.push (new Task ("Buy lotto", 
            "I hate my job. Time to GTFOOOOOOOOOOOOOOO"));
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
