import { Injectable } from '@angular/core';
import { HttpClient } from '../../node_modules/@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class TeamTasksService {
  
  private parentUrl = "https://comp4920-organiser.herokuapp.com";

  constructor(
    private http : HttpClient
  ) { }

  getList(teamId) : Observable<any>{
    return this.http.get(this.parentUrl + "/api/team/" + teamId + "/lists");
  }

  createList(list) : Observable<any>{
    //console.log(list.teamID);
    return this.http.post(this.parentUrl + '/api/list', list);
  }

  
}
