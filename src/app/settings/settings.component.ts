import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
//import { User } from '../user/user.model';
import { AuthService } from '../auth.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef} from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  emailOpenState = false;
  passOpenState = false;
  currPass : String;
  newPass : String;
  currEmail : String;
  newEmail : String;


  constructor(
    private router: Router,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  changePassword(){
    let thisC = this;
    this.auth.updatePassword(this.currEmail, this.newPass)
        .subscribe(function(res){
          let response;
          response = res;
          console.log(res);
          if(response.success){
            thisC.clearForm(true,"Password Updated!", "Close", {duration: 2000});
          } else {
            thisC.clearForm(false,"Error!", "Close", {duration: 2000});
          }
        })
  }

  clearForm(closeBar: boolean, snakBarMessage, snakBarAction, duration){
    if(closeBar){
      this.emailOpenState = false;
      this.passOpenState = false;
    }
    this.currEmail = "";
    this.newEmail = "";
    this.newPass = "";
    this.snackBar.open(snakBarMessage, snakBarAction, {duration: duration});
  }

  changeEmail(){
    let thisC = this;
    this.auth.updateEmail(this.currEmail, this.newEmail)
        .subscribe(function(res){
          let response;
          response = res;
          console.log(res);
          if(response.success){
            if(response.success){
              thisC.clearForm(true,"Email Updated!", "Close", {duration: 2000});
              
              //this.getNewToken(this.currEmail, this.newPass);
            } else {
              thisC.clearForm(false,"Error!", "Close", {duration: 2000});
            }
          }
        });
  }

  getNewToken(email, pass){
    this.auth.authenticate(email,pass)
        .subscribe(function(res){
          let response;
          response = res;
          if(res.success){
            let token = res.token
            localStorage.removeItem('token');
            localStorage.setItem('token', res.token);
          }
        })
  }
}
