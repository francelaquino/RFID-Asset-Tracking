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
import { WorkorderModel } from 'src/app/models/workordermodel';
import { WorkorderService } from 'src/app/services/workorder.service';
import { EmployeeModel } from 'src/app/models/employeeModel';
import { ConfirmationService } from 'primeng/api';

declare var jQuery: any;
var Timer: any;
var ItemCount = 0;
var Tags = '';
@Component({
  selector: 'app-workorderinquiry',
  templateUrl: './workorderinquiry.component.html',
  styleUrls: ['./workorderinquiry.component.scss'],
})
export class WorkorderinquiryComponent implements OnInit {
  loading: boolean = false;
  isStart: boolean = false;
  isCompleted: boolean = false;
  isInvalid: boolean = false;
  isResultReady: boolean = false;
  formGroup!: FormGroup;
  items: AssetModel[] = [];
  employeeModel!: EmployeeModel;
  workorderModel: WorkorderModel[] = [];
  tagModel!: TagModel;
  bsModalRef!: BsModalRef;
  isReading: boolean = false;
  EmployeeTag: any;
  enableSubmit: boolean = false;
  workOrder: any = '';
  filteredEmployees: string[] = [];
  employees: string[] = [];
  removedTags: string[] = [];
  constructor(
    private workorderService: WorkorderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private tagService: TagService,
    private employeeService: EmployeeService,
    private assetService: AssetService,
    private fb: FormBuilder,
    private bsModalService: BsModalService
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  onChange = () => {
    if (this.formGroup.get('Employeeid')?.value === null)
      this.workorderModel = [];
  };
  onGetEmployeeDetails() {
    if (this.formGroup.get('Employeeid')?.value === null) return;
    this.employeeService
      .getEmployeeByEmployeeId(
        String(this.formGroup.get('Employeeid')?.value).split(' - ')[0]
      )
      .subscribe({
        next: (r) => (this.employeeModel = r),
        error: (e) => {
          this.loading = false;
          this.messageService.add({ severity: 'error', detail: e });
        },
        complete: () => {
          if (this.employeeModel == null) {
            this.messageService.add({
              severity: 'error',
              detail: 'Invalid employee id',
            });
          } else {
            this.formGroup.patchValue({
              Employeename:
                this.employeeModel.Firstname +
                ' ' +
                this.employeeModel.Lastname,
            });

            setTimeout(() => {
              this.workorderService
                .getWorkOrdersByEmployeeId(this.employeeModel.Employeeid)
                .subscribe({ next: (r) => (this.workorderModel = r) });
            }, 500);

            this.isStart = true;
          }
          this.loading = false;
        },
      });
  }

  onWorkOrderChange(value: any) {
    this.getWorkOrderItems(value);
    if (value != '') {
      this.enableSubmit = true;
      this.workOrder = value;
    } else {
      this.enableSubmit = false;
      this.workOrder = '';
    }
  }

  getWorkOrderItems(Id: any) {
    this.enableSubmit = true;
    this.workorderService
      .getWorkOrderItems(Id)
      .subscribe({ next: (r) => (this.items = r) });
  }

  onWorkOrderClose() {
    let isAllCheckin = true;

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].Status != 'Checkin') {
        isAllCheckin = false;
      }
    }
    if (isAllCheckin) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to close the work order?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.workorderService.closeWorkOrder(this.workOrder).subscribe({
            next: (r) => {
              this.messageService.add({
                severity: 'success',
                detail: 'Workorder successfully closed',
              });
              this.workorderModel = [];
              this.enableSubmit = false;
              this.items = [];
              this.formGroup.patchValue({
                Employeename: '',
                Employeeid: '',
              });
            },
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'info',
        detail: 'Please checkin all items before closing the work order',
      });
    }
  }

  initForm() {
    this.formGroup = this.fb.group({
      Workorderid: new FormControl(''),
      Employeename: new FormControl(''),
      Employeeid: new FormControl(''),
      Location: new FormControl('', Validators.required),
      Tag: new FormControl(''),
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
  getItemInformations() {
    for (let i = 0; i < this.items.length; i++) {
      var tag = this.items[i].Tag;

      this.tagService.searchTagByRfid(tag).subscribe({
        next: (r) => (this.tagModel = r),
        error: (e) => {},
        complete: () => {
          this.items[i].Itemname = this.tagModel.Name;
          this.items[i].Category = this.tagModel.Category;
          this.items[i].Type = this.tagModel.Type;
          this.items[i].Manufacturer = this.tagModel.Manufacturer;
          this.items[i].Model = this.tagModel.Model;
          this.items[i].Id = this.tagModel.Id;
          this.items[i].Guid = this.tagModel.Guid;
          this.items[i].Description =
            this.tagModel.Name +
            ' ' +
            this.tagModel.Category +
            ' ' +
            this.tagModel.Type;

          if (this.items[i].Itemname != 'Unrecognized') {
            Tags = Tags + this.items[i].Tag + ',';
          }
        },
      });
    }
  }

  onRemoveItem(rfid: string) {
    this.items = this.items.filter((tag) => tag.Tag !== rfid);
  }

  onClearItems() {
    this.items = [];
    Tags = '';
  }
}
