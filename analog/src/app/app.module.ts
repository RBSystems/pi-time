import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatToolbarModule,
  MatButtonModule,
  MatGridListModule
} from "@angular/material";

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./components/app.component";
import { LoginComponent } from "./components/login/login.component";
import { JobsComponent } from "./components/jobs/jobs.component";
import { ByuIDPipe } from "./pipes/byu-id.pipe";

@NgModule({
  declarations: [AppComponent, LoginComponent, JobsComponent, ByuIDPipe],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
