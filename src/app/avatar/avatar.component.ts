import { Component, Input, OnInit } from '@angular/core';

import { User } from '../user.model';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {

  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }

}
