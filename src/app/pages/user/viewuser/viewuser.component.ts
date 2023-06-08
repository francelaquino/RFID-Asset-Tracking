import { Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../../../models/usermodel';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.scss'],
})
export class ViewuserComponent implements OnInit {
  items: UserModel[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => (this.items = data));
  }

  onAddnewUser() {
    this.router.navigate(['/user/newuser']);
  }
}
