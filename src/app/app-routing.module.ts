import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent }       from './login/login.component';
import { SignupComponent }      from './signup/signup.component';
import { TaskControlComponent } from './tasklistC/taskcontrol.component';

import { AppLayoutComponent }   from './layouts/app-layout/app-layout.component';
import { AuthLayoutComponent }   from './layouts/auth-layout/auth-layout.component';
import { TeamManagementComponent } from './teammanage/tmanager.component';
import { TeamCreateComponent } from './teammanage/tcreate/tcreate.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth', component: AuthLayoutComponent, children: [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
  ]},
  { path: 'app', component: AppLayoutComponent, children: [
      { path: '', component: TaskControlComponent },
      { path: 'teamcreate', component: TeamCreateComponent }
  ]}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
