import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

import { Message } from './message.model';
import { User } from '../../user.model';

import { AuthService } from '../../auth.service';

@Component ({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css']
})

export class MessageComponent {

    @Input() message: Message;
    mine = false;
    currentUser: User;
    formattedDate: string;

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.currentUser = this.authService.getDecodedToken();
        this.mine = this.message.createdBy._id === this.currentUser._id;

        const datePrefix = !this.mine ? `${this.message.createdBy.username} at ` : '';
        this.formattedDate = `${datePrefix}${moment(this.message.createdAt).fromNow()}`;
    }
}
