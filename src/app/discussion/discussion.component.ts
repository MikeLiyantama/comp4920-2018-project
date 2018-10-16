import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';

import { AuthService } from '../auth.service';

import { Message } from './message/message.model';
import { User } from '../user.model';

@Component({
    selector: 'app-discussion',
    templateUrl: './discussion.component.html',
    styleUrls: ['./discussion.component.css']
})

export class DiscussionComponent implements OnInit {

    @Input() messages: Message[];
    @Input() loading: boolean;
    @Output() messageInputted = new EventEmitter<string>();
    sendHighlight="primary"
    message: string;

    constructor (
        private _formBuilder: FormBuilder,
        private authService: AuthService,
    ) {    
    }

    ngOnInit () {
    }

    resetInput () {
        this.message = '';
    }

    sendMessage () {
        if (this.message && this.message !== '') {
            // Disregard empty comments
            this.messageInputted.emit(this.message);
        }
        
    }

}
