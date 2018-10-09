import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent }       from './login/login.component';
import { SignupComponent }      from './signup/signup.component';
import { TaskControlComponent } from './tasklistC/taskcontrol.component';

import { AppLayoutComponent }   from './layouts/app-layout/app-layout.component';
import { AuthLayoutComponent }   from './layouts/auth-layout/auth-layout.component';
import { TeamCreateComponent } from './teammanage/tcreate/tcreate.component';
import { TeamDashComponent } from './teammanage/teamdash/teamdash.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth', component: AuthLayoutComponent, children: [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
  ]},
  { path: 'app', component: AppLayoutComponent, children: [
      { path: '', component: TaskControlComponent },
      { path: 'teamcreate', component: TeamCreateComponent },
      { path: 'teamdash', component: TeamDashComponent, runGuardsAndResolvers: 'always' }
  ]}
];

@NgModule({
imports: [ RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
