import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.css']
})
export class SelectUserComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  
  }

  signIn() {

    this.router.navigate(['createReport']);
  }
}
