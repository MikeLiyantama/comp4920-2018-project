import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  wrongpass: string;
  username: string;
  password: string;

  constructor() { }

  ngOnInit() {
  }

  checkAuth() {
    var info = this.getInfo();
    var user = info[0];
    var pass = info[1];

    //check for valid login
    //set wrongpass to non-undefined if not valid
    this.wrongpass = user + pass;
  }

  getInfo() {
    var user = this.username;
    var pass = this.password;

    var info = [user, pass];
    
    return info;
  }
}
