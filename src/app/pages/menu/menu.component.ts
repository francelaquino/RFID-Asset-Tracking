import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessService } from 'src/app/services/access.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  roles: any;
  constructor(private Router: Router, private accessService: AccessService) {}

  checkRoles = (access: string) => {
    return String(this.roles).indexOf(access) >= 0;
  };
  ngOnInit(): void {
    var isLogin = localStorage.getItem('IsLogin');
    if (isLogin != '1') {
      this.Router.navigate(['login']);
    }

    if (
      sessionStorage.getItem('roles') === null ||
      sessionStorage.getItem('roles') === 'null' ||
      sessionStorage.getItem('roles') === '' ||
      sessionStorage.getItem('roles') === undefined
    ) {
      console.log(this.roles);
      this.accessService.getUserRoles().subscribe((data) => {
        this.roles = data;
        sessionStorage.setItem('roles', this.roles);
      });
    } else {
      this.roles = sessionStorage.getItem('roles');
    }
  }

  Logout(): void {
    localStorage.setItem('IsLogin', '0');
    this.Router.navigate(['login']);
    sessionStorage.setItem('roles', '');
  }
}
