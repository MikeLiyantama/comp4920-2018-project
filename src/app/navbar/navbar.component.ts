import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RightPaneService } from '../rightpane.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentUserId: String;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
    
  constructor(
    private breakpointObserver: BreakpointObserver,
    private rightPaneService: RightPaneService,
    private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit(){
    let thisC = this;
    this.authService.getCurrentUser()
        .subscribe(function(res){
          if(res.currUser){
            thisC.currentUserId = res.currUser;
          }
        })
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  
}
