import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";

@Injectable({
  providedIn: "root"
})
export class APIService {
  public theme = "default";

  private jsonConvert: JsonConvert;
  private urlParams: URLSearchParams;

  constructor(private http: HttpClient) {
    this.jsonConvert = new JsonConvert();
    this.jsonConvert.ignorePrimitiveChecks = false;

    this.urlParams = new URLSearchParams(window.location.search);
    if (this.urlParams.has("theme")) {
      this.theme = this.urlParams.get("theme");
    }
  }

  public switchTheme(name: string) {
    console.log("switching theme to", name);

    this.theme = name;
    this.urlParams.set("theme", name);
    window.history.replaceState(
      null,
      "BYU Time Clock",
      window.location.pathname + "?" + this.urlParams.toString()
    );
  }
}
