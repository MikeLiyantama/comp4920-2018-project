import { Component, Input } from '@angular/core';
import { Message } from '../message.model';
import { User } from '../../../user/user.model';

@Component ({
    selector: 'app-received',
    templateUrl: './received.component.html',
    styleUrls: ['./received.component.css']
})

export class ReceivedComponent {
    @Input () message: Message;
}
