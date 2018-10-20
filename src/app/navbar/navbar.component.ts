import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppbarService } from '../appbar.service';
import { RightPaneService } from '../rightpane.service';
import { AuthService } from '../auth.service';

import { User } from '../user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  currentUser: User;
  drawerOpened = false;
  title = '';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    public appbarService: AppbarService,
    private breakpointObserver: BreakpointObserver,
    public rightPaneService: RightPaneService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getDecodedToken();
  }

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
