import { Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeModel } from '../../../models/employeeModel';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-searchemployee',
  templateUrl: './searchemployee.component.html',
  styleUrls: ['./searchemployee.component.scss'],
})
export class SearchemployeeComponent implements OnInit {
  items: EmployeeModel[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService
      .getEmployees()
      .subscribe((data) => (this.items = data));
  }
}
