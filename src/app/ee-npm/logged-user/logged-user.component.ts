import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response, RequestMethod, Request } from '@angular/http';

@Component({
  selector: 'app-logged-user',
  templateUrl: './logged-user.component.html',
  styleUrls: ['./logged-user.component.css']
})
export class LoggedUserComponent implements OnInit {

  data: any;
  showUName: string;
  fullName: string;
  lastLoggedIn: any;
  constructor(private http: Http,
    private localstorageService: LocalStorageService, private router: Router) {
  }

  ngOnInit() {
  }

  doLogout() {
  }

}
