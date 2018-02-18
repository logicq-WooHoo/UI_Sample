
export class NewReportModel {
  reportTypes: string[];
  graphTypes: string[];
  aggregationTypes: string[];
  granularities: string[];
  properties: string[]; ///dimensions
  kpis: string[]; //metric
  threholdValues: number[];
  dimensions: Array<String> = [];

  reportTypeConfigList: Array<any> = [];
  SamplingPeriodList: Array<any> = [];
  timeRangeList: Array<any> = [];
  timeStringList: Array<string> = [];

  reportRequest: any;
  // properties:Map<any,any>=new Map();

  constructor() {
    this.reportTypes = ["Graph", "Table", "TopN"];
    this.graphTypes = ["Line", "Bar", "Pie", "Gauge", "Table"];
    this.aggregationTypes = ["SUM", "MIN", "MAX", "AVG", "COUNT"];
    this.granularities = ["All", "Hourly", "Daily"];
    this.properties = ["ip", "part", "maxspeed", "duplex", "source", "parttype", "deviceid", "devtype", "unit", "btcusid",
      "location", "btcusna", "btsitid"];
    this.kpis = ["Availability", "Reachability", "FreeMemoryPct", "ifInErrors", "ifInDiscards", "FreeMemory",
      "InboundUtilization", "ifInOctets", "ifInUcastPkts", "ifOutUcastPkts", "ifSpeed", "ifOutDiscards",
      "ifOutOctets", "ifOutErrors", "OutboundUtilzation", "ifInNUcastPkts", "MemoryUtilization"];
    this.threholdValues = [10, 20, 30];

    this.reportTypeConfigList = [{
      type: "Graph",
      subTypeList: ["Line", "Bar", "Stacked Line", "Stacked Bar", "Horizontal Bar"]
    },

    {
      type: "TopN",
      subTypeList: ["Bar", "Horizontal Bar", "Pie", "Donut Pie"]
    },

    {
      type: "Table",
      subTypeList: ["Table"]
    },
    {
      type: "Gauge",
      subTypeList: ["Gauge"]
    }];


    this.SamplingPeriodList = ["5 minutes", "15 minutes", "hour", "week", "year", "real time", "all"];
    this.timeRangeList = ["15 minutes",  "1 hour", "6 hours","12 hours", "1 day", "1 week", "1 month", "1 year"];
    this.timeStringList = ["Last", "Current", "Previous", "Custom"];
    this.reportRequest = {
      "jsonString": {
        "granularity": "ALL",
        "configuration": {
          "deviceType": "MME",
          "type": "groupBy",
          "metrics": [],
          "kpiMetrics":[],
        },

        "intervals": "2017-09-15T07:00:00.000Z/2017-09-15T20:00:00.000Z",
        "pagination": {
          "pagesize": 1000,
          "pagenumber": 1
        }
      }
    };

  }


}
