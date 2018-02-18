import { Component, OnInit ,Output ,EventEmitter} from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.css']
})
export class ExportDataComponent implements OnInit {

  constructor() { }
exportFileTypes:any;
report :any ={chartResp:[],tableResp:{}};
exportType :string;
@Output() selectedType = new EventEmitter();
  ngOnInit() {
    this.exportFileTypes =["CSV","PDF","XLS"];
  }
  setModalValues(type,event){
    this.exportType = type;
    this.hideDropdownClick(event);
  }

  hideDropdownClick(event) {
    $(event.currentTarget).parents('div.drop-list').removeClass('show').addClass('hide');
  }

  cleardata(value){
    if(value == "true"){
       this.exportType = "";
    }
    console.log(value);
   
  }

  exportReport(){
    this.selectedType.emit({modal:"export",values:this.exportType});
  }

ngAfterViewInit(){
     $('.dropdown').on({
      focus: function () {
        $(this).siblings('div.drop-list').removeClass('hide');
        $(this).siblings('div.drop-list').addClass('show');
        if ($(this).parents('div.form-group').siblings().children('div.dropdown').length > 0) {
          if ($(this).parents('div.form-group').siblings().children('div.dropdown').find('div.drop-list').hasClass('show')) {
            $(this).parents('div.form-group').siblings().children('div.dropdown').find('div.drop-list').removeClass('show');
            $(this).parents('div.form-group').siblings().children('div.dropdown').find('div.drop-list').addClass('hide');
          }
        }
      }
    }).blur(function () {
      if($('div.drop-list:hover') &&  $('div.drop-list:hover').length == 0){
        $(this).siblings('div.drop-list').removeClass('show');
      $(this).siblings('div.drop-list').addClass('hide');
      }
      
    });

     $(".closeButton").click(function(){
         $(this).parents(".reportMenu").find('li').removeClass("active");
         $(".tabHolder").fadeOut();
         this.cleardata("true");
      });
}

}
