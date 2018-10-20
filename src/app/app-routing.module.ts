import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RecoverComponent } from './recover/recover.component';

import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { TaskListComponent } from './task-list/task-list.component';
import { CreateTaskListComponent } from './create-task-list/create-task-list.component';
import { CreateTeamComponent } from './teammanage/create-team/create-team.component';
import { TeamDashComponent } from './teammanage/teamdash/teamdash.component';
import { TeamDetailComponent } from './teammanage/teamdetail/teamdetail.component';
import { TeamTasksComponent }from './teammanage/team-tasks/team-tasks.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth', component: AuthLayoutComponent, children: [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'recover', component: RecoverComponent }
  ]},
  { path: 'app', component: AppLayoutComponent, children: [
    { path: '', redirectTo: '/app/today', pathMatch: 'full' },
    { path: 'settings', component: SettingsComponent },
    { path: 'profile/:profileID', component: ProfileComponent },
    { path: 'teams/create', component: CreateTeamComponent },
    { path: 'teams/:teamId/lists/:listId', component: TeamTasksComponent },
    { path: 'teams/:teamId/:tab', component: TeamDetailComponent },
    { path: 'teams/:teamId', component: TeamDetailComponent },
    { path: 'teams', component: TeamDashComponent, runGuardsAndResolvers: 'always' },
    { path: 'lists/create', component: CreateTaskListComponent },
    { path: 'lists/:listId', component: TaskListComponent },
    { path: 'today', component: TaskListComponent },
    { path: 'me', component: TaskListComponent },
  ]}
];

@NgModule({
imports: [ RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
