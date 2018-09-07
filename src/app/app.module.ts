import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TaskControlComponent } from './tasklistC/taskcontrol.component';
import { TaskDisplayComponent } from './tasklistC/taskdispC/taskdisplay.component';
import { TaskFormComponent } from './tasklistC/taskformC/taskform.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskControlComponent,
    TaskDisplayComponent,
    TaskFormComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
