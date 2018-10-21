import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  loading = true;
  isUser: boolean;
  editMode = false;
  id: String;
  name: String;
  bio: String;
  profile: any;
  username: String;
  email: String;

  //For edit profile purpose
  editName: String;
  editBio: String;
  editProfile: any;
  editUsername: String;

  constructor(
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
    const thisC = this;

    //Get ID from URL
    this.id = thisC.activatedRoute.snapshot.paramMap.get('profileID');

    //Get Data for id
    thisC.profileService.getUserData(this.id)
    .subscribe(function(res) {
      let response;
      response = res;
      if (response._id) {
        thisC.name = response.name;
        thisC.username = response.username;
        thisC.bio = response.bio;
        thisC.profile = response.profile;
        thisC.email = response.email;

        thisC.editBio = response.bio;
        thisC.editName = response.name;
        thisC.editProfile = response.profile;
        thisC.editUsername = response.username;

        thisC.profileService.getCurrentId()
        .subscribe(function(res) {
            let response;
            response = res;
            const currentUserId = response.currUser;
            if (currentUserId == thisC.id) {
              thisC.isUser = true;
            } else {
              thisC.isUser = false;
            }
            thisC.loading = false;
        });
      }
    });
  }

  updateData() {
    const thisC = this;

    this.profileService.updateUserData(this.name, this.username, this.bio, this.profile)
        .subscribe(function(res) {
          let response;
          response = res;
          if (response.success) {
            thisC.name = thisC.editName;
            thisC.bio = thisC.editBio;
            thisC.username = thisC.editUsername;
            thisC.profile = thisC.editProfile;
            thisC.editMode = false;
            thisC.snackBar.open('Profile Updated!', 'Close', {duration: 3000});
          } else {
            this.editBio = this.bio;
            this.editName = this.name;
            this.editProfile = this.profile;
            this.editUsername = this.username;
            thisC.editMode = false;
            thisC.snackBar.open('Error, Please Try again', 'Close', {duration: 3000});
          }
        });
  }

  setImage (givenFile) {
    this.profile = givenFile;
    if (this.profile) {
    }
}

  enterEditMode() {
    this.editMode = true;
  }

  leaveEditMode() {
    this.editBio = this.bio;
    this.editName = this.name;
    this.editProfile = this.profile;
    this.editUsername = this.username;
    this.editMode = false;
  }
}
