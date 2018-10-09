import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppbarService } from '../appbar.service';
import { RightPaneService } from '../rightpane.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  drawerOpened: boolean = false;
  title: string = '';
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
    
  constructor(
    private appbarService: AppbarService,
    private breakpointObserver: BreakpointObserver,
    private rightPaneService: RightPaneService,
    private router: Router,
  ) { }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  openDrawer() {
    this.drawerOpened = true;
  }

  closeDrawer() {
    this.drawerOpened = false;
  }

  onDrawerCloseRequested(requested: boolean) {
    if (requested) {
      this.closeDrawer();
    }
  }
}
