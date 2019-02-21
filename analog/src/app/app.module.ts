import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule } from "@angular/material";

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./components/app.component";
import { LoginComponent } from "./components/login/login.component";
import { JobsComponent } from "./components/jobs/jobs.component";

@NgModule({
  declarations: [AppComponent, LoginComponent, JobsComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
