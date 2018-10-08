import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { User } from '../user/user.model';
import { MatSnackBar } from '@angular/material'
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isUser : boolean;
  editMode : boolean = false;
  name : String;
  bio : String;
  profile : String;
  username : String;
  profilePicUrl : String;
  email : String;
  constructor(
    private router: Router,
    private customRoute: ActivatedRoute,
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    let thisC = this;
    this.profileService.getUserData()
        .subscribe(function(res){
          let response;
          response = res;
          console.log(res);
          if(response._id){
            thisC.name = response.name;
            thisC.username = response.username;
            thisC.bio = response.bio;
            thisC.profile = response.profile;
            thisC.email = response.email;
          }
        });
  }

  updateData(username, name, bio, profile){
    let thisC = this;
    this.profileService.updateUserData(name, username, bio, profile)
        .subscribe(function(res){
          let response;
          response = res;
          if(response.success){
            thisC.leaveEditMode();
            thisC.snackBar.open("Profile Updated!", "Close", {duration:3000});
          }else{
            thisC.snackBar.open("Error, Please Try again", "Close", {duration:3000});
          }
        })

    
  }

  enterEditMode(){
    this.editMode = true;
  }



  leaveEditMode(){
    this.editMode = false;
  }
}
