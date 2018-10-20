import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent implements OnInit {

  error: boolean; // set to true at any kind of error (email doesn't exist, code not correct, new password not correct)
  sent: boolean; // set to true when the email is sent
  username: string; // email input
  serverCode: string; // code that is sent to user's email by the server
  userCode: string; // code that is input by the user
  codeCorrect: boolean; // set to true if serverCode and userCode are the same
  newPassword: string; // new password input by the user
  errorMessage: string;
  success = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  sendEmail() { ///api/account/email_verification
    // send username to backend to check if user exists
    // if the user exists, send an email to the user with a code

    let response;

    this.authService.checkEmail(this.username).subscribe(res => {
      response = res;
      if (response.success) {
        this.error = false;

        // verification here
        this.verifyEmail();

      } else {
        this.error = true;
      }

    });
  }

  checkCode() {
    // check if the code user entered is the same as the code sent
    if (this.serverCode == this.userCode) {
      this.codeCorrect = true;
      this.error = false;
    } else {
      this.codeCorrect = false;
      this.error = true;
    }
  }

  verifyEmail() {
    let response;

    this.authService.validate(this.username).subscribe(res => {
      response = res;
      if (response.success) {
        this.error = false;
        this.sent = true;
        this.serverCode = response.code;
        this.errorMessage = undefined;
      } else if (response.error == 'Error occured when sending email') {
        this.error = true;
        this.errorMessage = response.error;

      } else {
        this.error = true;
        this.errorMessage = undefined;
      }

    });

  }

  // send request to backend to change to a new password input by the user
  newPass(event) {
    // this.error = true;
    event.preventDefault();
    let response;

    this.authService.changeEmail(this.username, this.newPassword).subscribe(res => {
      response = res;


      if (response.success) { // if successful
        this.error = false;
        this.success = true;
        // this.router.navigate(['/login']);
      } else {
        this.error = true;
        this.errorMessage = response.error;

      }
    });

  }

}
