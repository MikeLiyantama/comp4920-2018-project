import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupserviceService } from '../signupservice.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  username: string;
  password: string;
  confirmPassword: string;
  invalid: string;
  exists: boolean = false;

  constructor(
    private router: Router,
    private signupservice: SignupserviceService
  ) { }

  ngOnInit() {
  } 

  signup() {
    var info = this.getInfo();
    var user = info[0];
    var pass = info[1];
    var cpass = info[2];

    var response;

    if (this.checkValid(user, pass, cpass)) {
      this.invalid = undefined;
      this.signupservice.register(user, pass)
        .subscribe(res => {
          response = res;
          if (response.success) {
            this.router.navigate(['/login']);
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
    var user = this.username;
    var pass = this.password;
    var cpass = this.confirmPassword;

    var info = [user, pass, cpass];
    
    return info;
  }
}
