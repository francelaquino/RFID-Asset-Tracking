import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AssetModel } from '../../../models/assetModel';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AssetService } from 'src/app/services/asset.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { TagService } from 'src/app/services/tag.service';
import { TagModel } from 'src/app/models/tagmodel';
import { MessageService } from 'primeng/api';
import { WorkorderService } from 'src/app/services/workorder.service';
import { EmployeeModel } from 'src/app/models/employeeModel';
import { LookupService } from 'src/app/services/lookup.service';
import { LookupModel } from 'src/app/models/lookupModel';

/*import 'jquery';*/
declare var jQuery: any;

@Component({
  selector: 'app-createworkorder',
  templateUrl: './createworkorder.component.html',
  styleUrls: ['./createworkorder.component.scss'],
  providers: [MessageService],
})
export class CreateworkorderComponent implements OnInit {
  loading: boolean = false;
  formGroup!: FormGroup;
  items: AssetModel[] = [];
  tagModel!: TagModel;
  bsModalRef!: BsModalRef;
  employeeModel!: EmployeeModel;
  isReading: boolean = false;
  lookupLocation: LookupModel[] = [];
  workOrderId!: any;
  filteredEmployees: string[] = [];
  employees: string[] = [];
  constructor(
    private lookupService: LookupService,
    private workorderService: WorkorderService,
    private messageService: MessageService,
    private tagService: TagService,
    private employeeService: EmployeeService,
    private assetService: AssetService,
    private fb: FormBuilder,
    private bsModalService: BsModalService
  ) {
    this.initForm();
  }

  filterEmployee = (event: any) => {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.employees.length; i++) {
      let employee = this.employees[i];
      if (employee.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        filtered.push(employee);
      }
    }

    this.filteredEmployees = filtered;
  };

  ngOnInit(): void {}
  initForm() {
    this.formGroup = this.fb.group({
      Workorderdate: new FormControl('', Validators.required),
      Description: new FormControl('', Validators.required),
      Employeeid: new FormControl(''),
      Employeename: new FormControl(''),
      Updatedby: new FormControl(''),
    });

    this.employeeService.getEmployees().subscribe({
      next: (r) => {
        r.map((employee) => {
          this.employees.push(
            employee.Employeeid +
              ' - ' +
              employee.Firstname +
              ' ' +
              employee.Lastname
          );
        });
      },
    });
    this.lookupService
      .getLocations()
      .subscribe({ next: (r) => (this.lookupLocation = r) });
  }

  // onGetEmployeeDetails() {
  //   this.employeeService
  //     .getEmployeeByEmployeeId(
  //       String(this.formGroup.get('Employeeid')?.value).split(' - ')[0]
  //     )
  //     .subscribe({
  //       next: (r) => (this.employeeModel = r),
  //       error: (e) => {
  //         this.loading = false;
  //         this.messageService.add({ severity: 'error', detail: e });
  //       },
  //       complete: () => {
  //         if (this.employeeModel == null) {
  //           this.messageService.add({
  //             severity: 'error',
  //             detail: 'Invalid employee id',
  //           });
  //         } else {
  //           this.formGroup.patchValue({
  //             Employeename:
  //               this.employeeModel.Firstname +
  //               ' ' +
  //               this.employeeModel.Lastname,
  //           });
  //         }
  //         this.loading = false;
  //       },
  //     });
  // }

  onClear() {
    this.items = [];
    this.formGroup.reset();
  }

  onSubmit() {
    this.formGroup.patchValue({
      Employeename: String(this.formGroup.get('Employeeid')?.value).split(
        ' - '
      )[1],
      Employeeid: String(this.formGroup.get('Employeeid')?.value).split(
        ' - '
      )[0],
    });
    if (
      !this.formGroup.valid ||
      this.formGroup.get('Employeeid')?.value === ''
    ) {
      this.messageService.add({
        severity: 'error',
        detail: 'Please fill required fields!',
      });
    } else {
      this.loading = true;
      let id = '';
      this.formGroup.patchValue({
        Updatedby: localStorage.getItem('Username'),
      });
      this.workorderService.addWorkorder(this.formGroup.value).subscribe({
        next: (r) => (this.workOrderId = r.body),
        error: (e) => {
          this.messageService.add({ severity: 'error', detail: e });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
          this.onClear();
          this.messageService.add({
            severity: 'success',
            detail:
              'Workorder successfully created with Work Order #:' +
              this.workOrderId,
          });
        },
      });
    }
  }

  isFieldValid(field: string) {
    return (
      !this.formGroup.get(field)?.valid && this.formGroup.get(field)?.touched
    );
  }

  hasError(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field),
    };
  }
}
