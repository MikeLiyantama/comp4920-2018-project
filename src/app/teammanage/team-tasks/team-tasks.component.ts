import { Component, OnInit , Injectable} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-team-tasks',
  templateUrl: './team-tasks.component.html',
  styleUrls: ['./team-tasks.component.css']
})
export class TeamTasksComponent implements OnInit {

  teamId: string;
  listId: string;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(function(params) {
      this.listId = params.get('listId');
      this.teamId = params.get('teamId');
    });
  }
}
