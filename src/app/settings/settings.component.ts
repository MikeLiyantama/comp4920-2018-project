import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user/user.model';
import { AuthService } from '../auth.service';

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
  ) { }

  ngOnInit() {
  }

  changePassword(){
    this.auth.updatePassword(this.currEmail, this.newPass)
        .subscribe(function(res){
          let response;
          response = res;
          console.log(res);
          if(response.success){
            this.emailOpenState = false;
            this.passOpenState = false;
            this.currEmail = "";
            this.newEmail = "";
            //add success msg
          } else {
            this.currEmail = "";
            this.newEmail = "";
            //Add Fail Msg
          }
        })
  }

  changeEmail(){
    this.auth.updateEmail(this.currEmail, this.newEmail)
        .subscribe(function(res){
          let response;
          response = res;
          console.log(res);
          if(response.success){
            this.emailOpenState = false;
            this.passOpenState = false;
            this.currEmail = "";
            this.newEmail = "";
            //add success msg
          } else {
            this.currEmail = "";
            this.newEmail = "";
            //Add Fail Msg
          }
        });
  }
}
