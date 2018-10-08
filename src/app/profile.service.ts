import { Injectable } from '@angular/core';
import { HttpClient} from '../../node_modules/@angular/common/http';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private userDataUrl = "https://comp4920-organiser.herokuapp.com/api/account/data";
  constructor(
    private http: HttpClient
  ) { }

  getUserData() {
    return this.http.get(this.userDataUrl);
  }

  updateUserData(name, username, bio, profile){
    let obj = {
      name: name,
      username: username,
      bio: bio,
      profile: profile
    }
    return this.http.post(this.userDataUrl, obj);
  }

  getCurrentId(){
    return this.http.get("https://comp4920-organiser.herokuapp.com/api/me")
  }
}
