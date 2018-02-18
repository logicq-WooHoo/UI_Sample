export class Configuration{
   constructor(public baseUrl: string,public offset : number,public refreshInterval :number, public druidBaseUrl: string, public httpRestCall :boolean,public offsetHours :number,public countersAllowedGroupBy :number,public propertiesAllowedGroupBy :number){}

}