import { Component, OnInit } from '@angular/core';

import { CalendarEvent, CalendarView } from 'angular-calendar';
import * as moment from 'moment';

import { AppbarService } from '../appbar.service';
import { RightPaneService } from '../rightpane.service';
import { TaskService } from '../task.service';

import { Task } from '../task.model';

@Component({
  selector: 'app-upcoming-tasks',
  templateUrl: './upcoming-tasks.component.html',
  styleUrls: ['./upcoming-tasks.component.css']
})
export class UpcomingTasksComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  
  loading = true;
  viewDate = new Date();
  tasks: CalendarEvent[];

  constructor(
    private appbarService: AppbarService,
    private rightPaneService: RightPaneService,
    private taskService: TaskService,
  ) { }

  ngOnInit() {
    this.appbarService.setTitle('Upcoming');

    this.taskService.getTasks({ listId: 'upcoming' }).subscribe((tasks: Task[]) => {
      this.tasks = tasks.map(task => ({
        start: moment(task.dueDate).toDate(),
        title: task.title,
        meta: {
          ...task,
        }
      })) || [];
      this.loading = false;
    });
  }

  onTaskClick(task: CalendarEvent) {
    this.rightPaneService.setTask(task.meta);
    this.rightPaneService.open('detail', {
      copy: false,
      repeat: false,
    });
  }
}
