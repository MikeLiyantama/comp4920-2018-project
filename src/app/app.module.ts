import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LayoutModule } from '@angular/cdk/layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDatepickerModule, MatNativeDateModule, MatIconRegistry } from '@angular/material';
import { MatButtonModule, MatCheckboxModule, MatInputModule, MatToolbarModule, MatSidenavModule, MatListModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material';

import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarMomentDateFormatter,
  DateAdapter,
  MOMENT
} from 'angular-calendar';
import * as moment from 'moment';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NavbarComponent } from './navbar/navbar.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { TaskDetailComponent, MoveTaskDialogComponent } from './task-detail/task-detail.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskComponent } from './task/task.component';
import { CompletedTaskListComponent } from './completed-task-list/completed-task-list.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { RecoverComponent } from './recover/recover.component';
import { TeamManagementComponent } from './teammanage/tmanage/tmanager.component';
import { CreateTeamComponent } from './teammanage/create-team/create-team.component';
import { TeamMemberListItemComponent } from './teammanage/team-member-list-item/team-member-list-item.component';
import { TeamCardComponent } from './teammanage/teamcard/teamcard.component';
import { TeamDashComponent } from './teammanage/teamdash/teamdash.component';
import { TeamDetailComponent } from './teammanage/teamdetail/teamdetail.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { CreateTaskListComponent } from './create-task-list/create-task-list.component';
import { UserSelectComponent } from './user-select/user-select.component';
import { ManageCollaboratorsComponent } from './manage-collaborators/manage-collaborators.component';
import { AvatarComponent } from './avatar/avatar.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { MessageComponent } from './discussion/message/message.component';
import { TeamListComponent } from './teammanage/team-list/team-list.component';
import { TeamTasksComponent } from './teammanage/team-tasks/team-tasks.component';
import { UpcomingTasksComponent } from './upcoming-tasks/upcoming-tasks.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

export function momentAdapterFactory() {
  return adapterFactory(moment);
}

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    AppLayoutComponent,
    AuthLayoutComponent,
    TaskDetailComponent,
    MoveTaskDialogComponent,
    TaskListComponent,
    CompletedTaskListComponent,
    SettingsComponent,
    ProfileComponent,
    RecoverComponent,
    TeamManagementComponent,
    CreateTeamComponent,
    TeamMemberListItemComponent,
    ImageUploadComponent,
    TeamCardComponent,
    TeamDashComponent,
    TeamDetailComponent,
    LeftSidebarComponent,
    CreateTaskListComponent,
    UserSelectComponent,
    ManageCollaboratorsComponent,
    AvatarComponent,
    LeftSidebarComponent,
    DiscussionComponent,
    MessageComponent,
    TeamListComponent,
    TeamTasksComponent,
    UpcomingTasksComponent,
  ],
  entryComponents: [
    CompletedTaskListComponent,
    ManageCollaboratorsComponent,
    TeamTasksComponent,
    MoveTaskDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:8080', 'comp4920-organiser.herokuapp.com']
      }
    }),
    CalendarModule.forRoot(
      {
        provide: DateAdapter,
        useFactory: momentAdapterFactory,
      },
      {
        dateFormatter: {
          provide: CalendarDateFormatter,
          useClass: CalendarMomentDateFormatter
        }
      }
    ),
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    MatDividerModule,
    MatDialogModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatSnackBarModule,
    MatMenuModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    MatBottomSheetModule,
    DragDropModule,
    MatCardModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatGridListModule,
    MatBadgeModule,
    MatChipsModule,
    MatPaginatorModule,
  ],
  providers: [
    {
      provide: MOMENT,
      useValue: moment
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
