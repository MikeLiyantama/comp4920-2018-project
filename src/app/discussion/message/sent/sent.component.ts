import { Component, Input } from '@angular/core';
import { Message } from '../message.model';
import { User } from '../../../user/user.model';

@Component ({
    selector: 'app-sent',
    templateUrl: './sent.component.html',
    styleUrls: ['./sent.component.css']
})

export class SentComponent {
    @Input () message: Message;
}
