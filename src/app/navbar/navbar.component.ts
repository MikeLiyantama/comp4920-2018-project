import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppbarService } from '../appbar.service';
import { RightPaneService } from '../rightpane.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentUserId: String;

  drawerOpened: boolean = false;
  title: string = '';
  firstLetterOfUserName: string = '';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
    
  constructor(
    private appbarService: AppbarService,
    private breakpointObserver: BreakpointObserver,
    private rightPaneService: RightPaneService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    const currentUser = this.authService.getDecodedToken();
    if (!currentUser.profile || currentUser.profile === '') {
      this.firstLetterOfUserName = currentUser.username.charAt(0);
    }
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
