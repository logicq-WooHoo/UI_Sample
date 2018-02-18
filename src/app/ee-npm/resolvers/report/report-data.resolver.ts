
import { Injectable, Inject  } from '@angular/core';
import {Resolve ,ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router';
import { CommonGetterSetterService } from '../../services/common/common.getterSetter.service';
@Injectable()
export class ReportDataResolver implements Resolve<any> {
  constructor(private commonGetterSetterService: CommonGetterSetterService) {}

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      let reportConfigMap = this.commonGetterSetterService.getReportConfiguration();
    return reportConfigMap.get(route.params.templateId);
  }
}