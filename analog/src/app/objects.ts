import {
  JsonObject,
  JsonProperty,
  Any,
  JsonConverter,
  JsonCustomConvert
} from "json2typescript";

@JsonObject("TotalTime")
export class TotalTime {
  @JsonProperty("week", Integer, true)
  week: number = undefined;

  @JsonProperty("pay-period", Integer, true)
  payPeriod: number = undefined;
}

@JsonObject("WorkOrder")
export class WorkOrder {
  @JsonProperty("id", String, true)
  id: string = undefined;

  @JsonProperty("name", String, true)
  name: string = undefined;
}

@JsonObject("Punch")
export class Punch {
  @JsonProperty("in-time", DateConverter, true)
  time: Date = undefined;

  @JsonProperty("type", String, true)
  type: string = undefined;

  @JsonProperty("exception-type", String, true)
  exceptionType: string = undefined;

  @JsonProperty("name", String, true)
  name: string = undefined;
}

@JsonObject("WorkOrderBilling")
export class WorkOrderBilling {
  @JsonProperty("work-order", WorkOrder, true)
  workOrder: WorkOrder = undefined;

  @JsonProperty("billed-time", Integer, true)
  billedTime: number = undefined;
}

@JsonObject("Day")
export class Day {
  @JsonProperty("date", DateConverter, true)
  time: Date = undefined;

  @JsonProperty("has-time-sheet-exceptions", Boolean, true)
  hasTimesheetExceptions: boolean = undefined;

  @JsonProperty("punched-hours", Integer, true)
  punchedHours: number = undefined;

  @JsonProperty("punches", [Punch], true)
  punches: Punch[] = Array<Punch>();
}

@JsonObject("Employee")
export class Employee {
  id: string = undefined;
  name: string = undefined;
}

@JsonConverter
class DateConverter implements JsonCustomConvert<Date> {
  serialize(date: Date): any {
    function pad(n) {
      return n < 10 ? "0" + n : n;
    }

    return (
      date.getUTCFullYear() +
      "-" +
      pad(date.getUTCMonth() + 1) +
      "-" +
      pad(date.getUTCDate()) +
      "T" +
      pad(date.getUTCHours()) +
      ":" +
      pad(date.getUTCMinutes()) +
      ":" +
      pad(date.getUTCSeconds()) +
      "Z"
    );
  }

  deserialize(date: any): Date {
    if (date == null) {
      return undefined;
    }

    return new Date(date);
  }
}
