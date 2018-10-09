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

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NavbarComponent } from './navbar/navbar.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskComponent } from './task/task.component';
import { CompletedTaskListComponent } from './completed-task-list/completed-task-list.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileImageUploadComponent } from './profile-image-upload/profile-image-upload.component';
import { RecoverComponent } from './recover/recover.component';
import { TeamManagementComponent } from './teammanage/tmanage/tmanager.component';
import { TeamCreateComponent } from './teammanage/tcreate/tcreate.component';
import { MemcardComponent } from './teammanage/memcard/memcard.component';
import { ImageUploadComponent } from './teammanage/imgup/imgup.component';
import { TeamCardComponent } from './teammanage/teamcard/teamcard.component';
import { TeamDashComponent } from './teammanage/teamdash/teamdash.component';
import { TeamDisplayComponent } from './teammanage/teamdash/teamdisp/teamdisp.component';
import { TeamDetailsComponent } from './teammanage/teamdash/teamdetail/teamdetail.component';
import { MemfinderComponent } from './teammanage/memfinder/memfinder.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';

export function tokenGetter() {
  return localStorage.getItem('token');
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
    TaskListComponent,
    CompletedTaskListComponent,
    SettingsComponent,
    ProfileComponent,
    ProfileImageUploadComponent
    RecoverComponent,
    TeamManagementComponent,
    TeamCreateComponent,
    MemcardComponent,
    ImageUploadComponent,
    TeamCardComponent,
    TeamDashComponent,
    TeamDisplayComponent,
    TeamDetailsComponent,
    MemfinderComponent,
    LeftSidebarComponent
  ],
  entryComponents: [
    CompletedTaskListComponent
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
    MatBadgeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
