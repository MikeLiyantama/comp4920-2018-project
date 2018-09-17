import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule, MatNativeDateModule, MatIconRegistry } from '@angular/material';
import { MatButtonModule, MatCheckboxModule, MatInputModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppComponent } from './app.component';
import { TaskControlComponent } from './tasklistC/taskcontrol.component';
import { TaskDisplayComponent } from './tasklistC/taskdispC/taskdisplay.component';
import { TaskFormComponent } from './tasklistC/taskformC/taskform.component';
import { TaskComponent } from './tasklistC/taskdispC/taskC/task.component';


@NgModule({
  declarations: [
    AppComponent,
    TaskControlComponent,
    TaskDisplayComponent,
    TaskFormComponent,
    TaskComponent,
  ],
  imports: [
  BrowserModule,
  FormsModule,
  HttpModule,
  HttpClientModule,
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
  MatSelectModule,
  MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
