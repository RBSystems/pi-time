import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatToolbarModule,
  MatButtonModule,
  MatGridListModule,
  MatFormFieldModule,
  MatInputModule
} from "@angular/material";
import "hammerjs";

import { AppRoutingModule } from "./app-routing.module";

import { APIService } from "./services/api.service";

import { ByuIDPipe } from "./pipes/byu-id.pipe";

import { AppComponent } from "./components/app.component";
import { LoginComponent } from "./components/login/login.component";
import { JobsComponent } from "./components/jobs/jobs.component";

@NgModule({
  declarations: [AppComponent, LoginComponent, JobsComponent, ByuIDPipe],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [APIService],
  bootstrap: [AppComponent]
})
export class AppModule {}
