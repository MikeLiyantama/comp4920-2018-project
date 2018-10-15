import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Message } from './message/message.model';
import { User } from '../user/user.model';

@Component({
    selector: 'app-discussion',
    templateUrl: './discussion.component.html',
    styleUrls: ['./discussion.component.css']
})

export class DiscussionComponent implements OnInit {
    @Input () currentUser: User;
    @Input () messagesToRender;
    @Output () commentEmitter = new EventEmitter <Message>();
    sendHighlight="primary"
    comment: string;
    commentFormGroup;

    constructor (private _formBuilder: FormBuilder){}

    ngOnInit () {
        this.commentFormGroup = this._formBuilder.group({
            CommentCtrl: ['', Validators.required]
        });
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
