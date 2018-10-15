import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';

import { Message } from './message/message.model';
import { User } from '../user.model';

@Component({
    selector: 'app-discussion',
    templateUrl: './discussion.component.html',
    styleUrls: ['./discussion.component.css']
})

export class DiscussionComponent implements OnInit {

    /* Using dummy input for now. uncomment the @Input() lines 
    and delete the dummy data when the backend begins to 
    support team messages */
    dummyUser1 = {
        "_id" : "5bb83dfa989c130013247b42",
        "name" : "Andrew Nguyen",
        "username" : "andrew",
        "email" : "gold@gmail.com",
        "password" : "pass",
        "bio" : "",
        "profile" : ""
    };
    dummyUser2 = {
        "_id" : "5bb6966c54bc32001333a17a",
        "name" : "Eddard Stark",
        "username" : "wolfboy6534",
        "email" : "winter@gmail.com",
        "password" : "pass",
        "bio" : "",
        "profile" : ""
    };
    messagesToRender = [
        new Message ("Yo", this.dummyUser1, ""),
        new Message ("Hey there", this.dummyUser2, ""),
        new Message ("Did you watch the new movie?", this.dummyUser1, ""),
        new Message ("Yeah, I didn't get the ending though", this.dummyUser2, "")
    ];

    //@Input () messagesToRender;
    @Input () currentUser: User;
    @Output () commentEmitter = new EventEmitter <Message>();
    sendHighlight="primary"
    comment: string;
    commentFormGroup;

    constructor (private _formBuilder: FormBuilder){}

    ngOnInit () {
        this.commentFormGroup = this._formBuilder.group({
            CommentCtrl: ['', Validators.required]
        });
        console.log(this.messagesToRender);
        console.log(this.currentUser);
    }

    resetComment () {
        this.commentFormGroup.controls["CommentCtrl"].reset();
    }

    postComment () {
        var comment = this.commentFormGroup.controls["CommentCtrl"].value;
        if (comment) {
            // Disregard empty comments otherwise
            var date = new Date();
            var msg = new Message (comment, this.currentUser, date);
            this.commentEmitter.emit (msg);
            
            // TODO!!!!! SET THE CURRENT USER CORRECTLY FROM TEAMDETAIL ts

            console.log (this.currentUser);
        }
        
    }

}
