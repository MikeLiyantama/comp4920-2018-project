import { Component, Input } from '@angular/core';
import { Message } from './message.model';
import { User } from '../../user/user.model';

@Component ({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css']
})

export class MessageComponent {
    @Input () message: Message;
}
