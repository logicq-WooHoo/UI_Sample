import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { CommonFieldErrorUtilService } from '../ee-npm/services/common/common.field-error.util';
import { LoginService } from '../ee-npm/services/http/login/login.service';
import { DataLoadSpinner } from '../ee-npm/services/dataLoadSpinner.service';
import { MenuService } from '../ee-npm/services/menu/menu.service';
import { LocalStorageService} from 'angular-2-local-storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[CommonFieldErrorUtilService]
})
export class LoginComponent implements OnInit {
loginForm: FormGroup;
loginDetails:any={userName:"",password:""};
  constructor(private router: Router,public commonFieldErrorUtilService :CommonFieldErrorUtilService,private menuService:MenuService,private loginService :LoginService,private localStorageService:LocalStorageService,private _spinner : DataLoadSpinner) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'userName': new FormControl(this.loginDetails.userName, [
        Validators.required,
        Validators.minLength(4)]),
      
      'password':new FormControl(this.loginDetails.password,[Validators.required])

    });
    this.commonFieldErrorUtilService.setForm(this.loginForm);
  }

  signIn() {
    let request =this.loginDetails;
    request.userName = this.userName.value;
    this.localStorageService.set("menu",undefined);
    request.password = this.password.value;
    this.loginService.login(request).subscribe((data)=>{
       this.menuService.setMenu(data);
       this.menuService.setMenuSubject("Menu added");
         this.router.navigate(['report/createReport']);
         this.localStorageService.set("userName",this.userName.value);
    },(err)=>{
      if(err.status==401 || err.status==403){
        this._spinner.showErrorMessage("Incorrect Username or Password");
      }else if(err.status == 404){
         this._spinner.showErrorMessage("Server unavailable");
      }
    })

  }

  get userName() { return this.loginForm.get('userName')}
  get password() { return this.loginForm.get('password') }
}
