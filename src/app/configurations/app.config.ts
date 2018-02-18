import { Injectable, Inject} from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class AppConfig {
    refreshContinuously = true;
    inventoryBaseUrl = "/inventory/";
    reportBaseUrl = "/reports/";
    scheduleBaseUrl = "/task/";
    jsonBaseUrl = "./assets/jsonResponse/";
    kpiUrl ="/kpi/";
    dashboardBaseUrl="/dashboard/"; 
    getElementsDevice = this.inventoryBaseUrl + "getdevicetypes";
    getCounterGroups = this.inventoryBaseUrl + "getcountergroupsbydevicetype";
    getCounterGroupsByDeviceType = this.inventoryBaseUrl + "getcountergroupsbydevicetype";
    getCounterIds = this.inventoryBaseUrl + "getcountersbycountergroups";
    getNodeFromDevice = this.inventoryBaseUrl + "getelementsbyelementtype" ;
    getspecificreport = this.reportBaseUrl + "getspecificreport";
    getSubElementsFromNodes = this.inventoryBaseUrl +"getsubelementsbycountergroups";
    createKpi = this.kpiUrl+"addkpi";
    getKPI = this.kpiUrl+"kpilist";
    updatekpi= this.kpiUrl + "updatekpi";
    login = "/api/login";
    getUserReport = this.reportBaseUrl + "getUserReport";
    saveUserReport = this.reportBaseUrl + "saveUserReport";
    exportUserReport ="/api" + "/exportreport/downloadreport";
    getLevelsByDeviceType = this.inventoryBaseUrl + "getLevelByDeviceType";
    scheduleTaskURL = this.scheduleBaseUrl + "create";
    getCounterGroupsKPI = this.inventoryBaseUrl + "kpilistwithcountergroup";
    scheduleTasklistURL = this.scheduleBaseUrl + "list";
    deleteScheduledtaskURL = this.scheduleBaseUrl + "delete";
    updateScheduledtaskURL = this.scheduleBaseUrl + "update";
    getSpecificSubDashboard=this.dashboardBaseUrl+"getSpecificSubDashboard"; 
    getSubDashboardsForDashboard = this.dashboardBaseUrl+"getSubDashboards";

    getDruidResponseJSON = this.jsonBaseUrl + "DruidResponseJSON.json";
    getElementsDeviceJSON = this.jsonBaseUrl + "ElementDeviceJSON.json";
    getCounterGroupsJSON = this.jsonBaseUrl +"CounterGroupsJSON.json";
    getCounterIDsJSON = this.jsonBaseUrl + "CounterIDsJSON.json";
    getSpecificReportJSON = this.jsonBaseUrl + "getSpecficReportResponseNew.json";
    getSpecificReportRefreshedResponseJSON =this.jsonBaseUrl + "getSpecificReportRefreshedResponse.json";
    getSpecificReportDetailedJSON = this.jsonBaseUrl + "getSpecificReportDetailedResponse.json";
    getSubElementsFromNodesJSON = this.jsonBaseUrl + "getSubElementsFromNodes.json";
    getNodesFromNodeTypeJSON = this.jsonBaseUrl + "getNodesFromNodeType.json";
    getSuccessResponseJSON = this.jsonBaseUrl + "SuccessResponseJSON.json";
    LoginResponseJSON = this.jsonBaseUrl + "LoginResponseJSON.json";
    saveUserReportJSON = this.jsonBaseUrl + "saveReportJSON.json";
    getLevelsByDeviceTypeJSON = this.jsonBaseUrl + "getLevelsByDeviceTypeJSON.json";
    getCounterGroupsKPIJSON = this.jsonBaseUrl + "getCounterGroupsKPIJSON.json";
    getSpecificDashboardJSON = this.jsonBaseUrl + "getDashboardJSON.json";
    getScheduledReportJSON = this.jsonBaseUrl + "scheduledReportJSON.json";
    getSubDashboardsJSON = this.jsonBaseUrl + "getSubDashboardsResponse.json";
    getSpecificSubDashboardJSON=this.jsonBaseUrl  +"getSpecificSubDashboardResponseJSON.json";
    getSpecificReportResponseForDashboardReportJSON = this.jsonBaseUrl +"getSpecificReportResponseForDashboardReportJSON.json";
}