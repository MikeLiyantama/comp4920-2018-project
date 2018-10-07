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
  profilePicUrl : String;
  constructor(
    private router: Router,
    private customRoute: ActivatedRoute,
    private profileService: ProfileService,
  ) { }

  ngOnInit() {
    let thisC = this;
    this.profileService.getUserData()
        .subscribe(function(res){
          let response;
          response = res;
          console.log(res);
          if(response._id){
            thisC.updateData(response.username, response.name, response.bio, response.profile);
          }
        });
  }

  updateData(username, name, bio, profile){
    this.username = username;
    this.name = name;
    this.bio = bio;
    this.profile = profile;
  }
}
