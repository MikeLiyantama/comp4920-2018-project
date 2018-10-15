import { Component, Input, OnInit } from '@angular/core';

import { Message } from './message.model';

import { AuthService } from '../../auth.service';

@Component ({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css']
})

export class MessageComponent {

    @Input() message: Message;
    mine: boolean = false;

    constructor(private authService: AuthService) {        
    }

    ngOnInit() {
        const currentUser = this.authService.getDecodedToken();
        this.mine = this.message.author._id === currentUser._id;
    }
}
