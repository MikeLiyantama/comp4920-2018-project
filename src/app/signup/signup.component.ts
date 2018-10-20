import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupService } from '../signup.service';

import { User } from '../user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  invalid: string;
  exists = false;

  constructor(
    private router: Router,
    private signupService: SignupService
  ) { }

  ngOnInit() {
  }

  signup() {
    const info = this.getInfo();
    const user = info[0];
    const pass = info[1];
    const cpass = info[2];
    const name = info[3];
    const email = info[4];
    // name, username, email, pw, bio, profile
    const newUser = new User (name, user, email, pass, '', '');
    let response;

    if (this.checkValid(user, pass, cpass)) {
      this.invalid = undefined;
      this.signupService.register(newUser)
        .subscribe(res => {
          response = res;
          if (response.success) {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/app']);
            this.exists = false;
          } else {
            this.exists = true;
          }

        });

    } else {
      this.invalid = 'invalid inputs';
    }


  }

  checkValid(user, pass, cpass) {
    let valid = true;
    if (user === '' || pass === '' || cpass === '') {
      valid = false;
    }
    if (pass != cpass) {
      valid = false;
    }
    return valid;
  }

  getInfo() {
    const name = this.name;
    const email = this.email;
    const user = this.username;
    const pass = this.password;
    const cpass = this.confirmPassword;

    const info = [user, pass, cpass, name, email];

    return info;
  }
}
