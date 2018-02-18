import { Injectable } from '@angular/core';
import { Observable,Subject,BehaviorSubject } from 'rxjs';


@Injectable()
export class MenuService {
    private toggledSubject = new Subject<any>();
    private menuSubject = new BehaviorSubject<any>(null);
    private menu :any;

    setToggleValue(toggled:boolean) {
        this.toggledSubject.next({ value:toggled });
    }

    clearToggleVal() {
        this.toggledSubject.next();
    }

    getToggledValue(): Observable<any> {
        return this.toggledSubject.asObservable();
    }

    setMenuSubject(menu :any){
        this.menuSubject.next({value :  menu});
    }

    getMenuSubject(): Observable<any> {
        return this.menuSubject.asObservable();
    }

    getMenu(){
        return this.menu;
    }

    setMenu(menu){
        this.menu = menu;
    }
}