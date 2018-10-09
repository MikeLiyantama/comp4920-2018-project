import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupService } from '../signup.service';
import { User } from '../user/user.model';


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
  exists: boolean = false;

  constructor(
    private router: Router,
    private signupService: SignupService
  ) { }

  ngOnInit() {
  } 

  signup() {
    var info = this.getInfo();
    var user = info[0];
    var pass = info[1];
    var cpass = info[2];
    var name = info[3];
    var email = info[4];
    // name, username, email, pw, bio, profile
    var newUser = new User (name, user, email, pass, '', ''); 
    var response;

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
        
        })

    } else {
      this.invalid = "invalid inputs";
    }

    
  }

  checkValid(user, pass, cpass) { 
    var valid: boolean = true;
    if (user === "" || pass === "" || cpass === "") {
      valid = false;
    }
    if (pass != cpass) {
      valid = false;
    }
    return valid;
  }

  getInfo() {
    var name = this.name;
    var email = this.email;
    var user = this.username;
    var pass = this.password;
    var cpass = this.confirmPassword;
    
    var info = [user, pass, cpass, name, email];
    
    return info;
  }
}
