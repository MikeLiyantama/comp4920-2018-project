import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
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
    TaskComponent
  ],
  imports: [
  BrowserModule,
  FormsModule,
  HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
