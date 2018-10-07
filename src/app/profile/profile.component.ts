import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { User } from '../user/user.model';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isUser : boolean;
  name : String;
  bio : String;
  profile : String;
  username : String;
  //profileImage : ImageBitmap;
  profilePicUrl : String;
  constructor(
    private router: Router,
    private customRoute: ActivatedRoute,
    private profileService: ProfileService,
  ) { }

  ngOnInit() {
    this.profileService.getUserData()
        .subscribe(function(res){
          let response;
          response = res;
          if(response._id){
            this.name = response.name;
            this.bio = response.bio;
            this.profile = response.profile;
            this.username = response.username;
            //this.profilePicUrl = 'http://comp4920-organiser.herokuapp.com/api/assets/profile_picture/' + response._id;
          }
        });
  }
}
