import { Component } from '@angular/core';
import { Task } from '../task.model';

@Component({
    selector: 'app-taskdisplay',
    templateUrl: './taskdisplay.component.html'
})

export class TaskDisplayComponent {
    // Populate this array from the DB for that user   
    // Chucking garbage in for now 
    tasks = [
    new Task (
        "Walk dog", 
        "Fido has been waiting for a little while. Lets go to the park."
    ),
    new Task (
        "Buy lotto", 
        "I hate my job. Time to GTFOOOOOOOOOOOOOOO"
    )
    ];    
    
}
