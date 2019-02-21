import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "jobs",
  templateUrl: "./jobs.component.html",
  styleUrls: ["./jobs.component.scss"]
})
export class JobsComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");

    // TODO make api call here
    console.log("id", id);
  }
}
