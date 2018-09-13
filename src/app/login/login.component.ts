import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  wrongpass: string;
  username: string;
  password: string;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit() {
  }

  checkAuth() {
    var info = this.getInfo();
    var user = info[0];
    var pass = info[1];

    var loginSuccess: number = 0;
    this.authService.authenticate(user, pass)
    .subscribe(
      (val) => {
        loginSuccess = val
      }
    );

    if (loginSuccess) {
      
      this.router.navigate(['/', user]);
      this.wrongpass = undefined;
    } 
    else {
      this.wrongpass = "not valid";
    }
  }

  getInfo() {
    var user = this.username;
    var pass = this.password;

    var info = [user, pass];
    
    return info;
  }
}
