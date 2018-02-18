import { Component, OnInit } from '@angular/core';
import { MenuService } from './services/menu/menu.service';
declare var $: any;
@Component({
  selector: 'app-npm',
  templateUrl: './ee-npm.component.html',
  styleUrls: ['./ee-npm.component.css']
})
export class EENpmComponent implements OnInit {
  toggleClass: boolean = false;
  constructor(private menuService: MenuService) { }

  ngOnInit() {
  }

  toggleClassEmit() {
    this.toggleClass = !this.toggleClass;
    this.menuService.setToggleValue(this.toggleClass);
  }

  ngAfterViewInit() {
    $(window).scroll(function () {
      if ($(window).scrollTop() > 0) {
        $("#toTop").fadeIn("slow");
      }
      else {
        $("#toTop").fadeOut("slow");
      }
    });
  }

  scrolltoTop(event){
     $("html, body").animate({
        scrollTop: 0
      }, "slow");
  }

  
}
