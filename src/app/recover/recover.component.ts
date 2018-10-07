import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'


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

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  sendEmail() { ///api/account/email_verification
    console.log(this.username);
    // send username to backend to check if user exists 
    // if the user exists, send an email to the user with a code

    var response;

    this.authService.checkEmail(this.username).subscribe(res => {
      response = res;
      if (response.success) {
        this.sent = true;
        this.error = false;
        this.serverCode = response.code;
      }

    })


    // this.error = true;
    this.sent = true;
  }

  checkCode() {
    
    // check if the code user entered is the same as the code sent
    // send request to backend to change to a new password input by the user
    this.codeCorrect = true;

  }

  newPass() {
    // this.error = true;


    // if successful 
    this.router.navigate(['/login']);
  }
}
