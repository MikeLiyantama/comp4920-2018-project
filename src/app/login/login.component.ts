import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

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
    const info = this.getInfo();
    const user = info[0];
    const pass = info[1];

    const loginSuccess = 0;
    let response;

    this.authService.authenticate(user, pass)
      .subscribe(res => {
        if (res.success) {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/app']);
          this.wrongpass = undefined;
        } else {
          this.wrongpass = 'not valid';
        }
      });


  }

  getInfo() {
    const user = this.username;
    const pass = this.password;

    const info = [user, pass];

    return info;
  }
}
