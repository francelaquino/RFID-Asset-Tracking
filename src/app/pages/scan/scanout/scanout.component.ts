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
import { Router } from '@angular/router';
import { ReaderModel } from 'src/app/models/readerModel';
import { ReaderService } from 'src/app/services/reader.service';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
declare var jQuery: any;
var Timer: any;
var ItemCount = 0;
var Tags = '';
@Component({
  selector: 'app-scanout',
  templateUrl: './scanout.component.html',
  styleUrls: ['./scanout.component.scss'],
})
export class ScanoutComponent implements OnInit {
  loading: boolean = false;
  isStart: boolean = false;
  isCompleted: boolean = false;
  isResultReady: boolean = false;
  formGroup!: FormGroup;
  items: AssetModel[] = [];
  groupItems: AssetModel[] = [];
  employeeModel!: EmployeeModel;
  workorderModel: WorkorderModel[] = [];
  tagModel!: TagModel;
  bsModalRef!: BsModalRef;
  isReading: boolean = false;
  EmployeeTag: string = '';
  enableSubmit: boolean = false;
  readerAddress: string = '';
  readerModel: ReaderModel[] = [];
  filteredEmployees: string[] = [];
  employees: string[] = [];
  removedTags: string[] = [];
  readerIp: string = '';
  private hubConnectionBuilder!: HubConnection;
  constructor(
    private router: Router,
    private workorderService: WorkorderService,
    private messageService: MessageService,
    private tagService: TagService,
    private employeeService: EmployeeService,
    private assetService: AssetService,
    private fb: FormBuilder,
    private bsModalService: BsModalService,
    private readerService: ReaderService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.readerService.getReaderByService('Scanout').subscribe({
      next: (r) => (this.readerModel = r),
      error: (e) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          detail: e,
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  onSearchEmpoyeeByTag(Tag: string) {
    this.employeeService.getEmployeeByRFID(Tag).subscribe({
      next: (r) => (this.employeeModel = r),
      error: (e) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          detail: e,
        });
      },
      complete: () => {
        if (this.employeeModel == null) {
          this.messageService.add({
            severity: 'error',
            detail: 'Invalid employee tag',
          });
        } else {
          this.isReading = false;
          this.formGroup.patchValue({
            Employeename:
              this.employeeModel.Firstname + ' ' + this.employeeModel.Lastname,
            Employeeid: this.employeeModel.Employeeid,
          });

          setTimeout(() => {
            this.workorderService
              .getWorkOrdersByEmployeeId(this.employeeModel.Employeeid)
              .subscribe({ next: (r) => (this.workorderModel = r) });
          }, 500);
          this.isStart = true;
        }
      },
    });
  }

  initForm() {
    this.formGroup = this.fb.group({
      Workorderid: new FormControl('', Validators.required),
      Employeename: new FormControl(''),
      Employeeid: new FormControl(''),
      Tag: new FormControl(''),
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

  onCheckOut() {
    let employee = this.formGroup.get('Employeeid')?.value;

    if (!this.formGroup.valid && employee === '') {
      this.messageService.add({
        severity: 'error',
        detail: 'Please fill required fields!',
      });
    } else {
      Tags = '';
      this.groupItems.map((tag) => {
        if (tag.IsSelected) {
          Tags = Tags + tag.Tag + ',';
        }
      });

      this.formGroup.patchValue({
        Tag: Tags,
        Employeename: String(this.formGroup.get('Employeeid')?.value).split(
          ' - '
        )[1],
        Employeeid: String(this.formGroup.get('Employeeid')?.value).split(
          ' - '
        )[0],
        Updatedby: localStorage.getItem('Username'),
      });
      this.workorderService.WorkOrderCheckout(this.formGroup.value).subscribe({
        //next: (r) => ,
        error: (e) => {
          this.messageService.add({ severity: 'error', detail: e });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
          this.isCompleted = true;

          this.messageService.add({
            severity: 'info',
            detail: 'Items successfully checkin',
          });
          this.onClearItems();
          this.formGroup.patchValue({
            Employeeid: employee,
          });
        },
      });
    }
  }

  onSearch(event: any) {
    this.onSearchEmpoyeeByTag(event.target.value);
  }
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

  onReaderChange(value: any) {
    this.readerAddress = value.target.value;

    this.readerService.getReaderById(value.target.value).subscribe({
      next: (r) => {
        this.readerAddress = r.Ipaddress;
        this.readerIp = r.ReaderIpaddress;
      },
      error: (e) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          detail: e,
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  onReadStart() {
    if (!this.formGroup.valid) {
      this.messageService.add({
        severity: 'error',
        detail: 'Please fill required fields!',
      });
    } else {
      if (this.readerAddress == '') {
        this.messageService.add({
          severity: 'error',
          detail: 'Please select reader',
        });
        return;
      }
      this.isReading = true;
      this.isResultReady = false;
      this.onClearItems();
      var root = this;
      var i = new AssetModel();
      this.hubConnectionBuilder = new HubConnectionBuilder()
        .withUrl(root.readerAddress + '/ConnectionHub')
        .configureLogging(LogLevel.Information)
        .build();

      this.hubConnectionBuilder
        .start()
        .then(() => console.log('Connection started.......!'))
        .catch((err) =>
          this.messageService.add({
            severity: 'error',
            detail: 'Error while connect with server. Please try again',
          })
        );

      this.hubConnectionBuilder.on(
        'ListenToData',
        (Ip: string, Tag: string) => {
          if (this.readerIp === Ip) {
            i = new AssetModel();
            i.Tag = Tag;
            var index = root.items.findIndex((x) => x.Tag === Tag);
            if (index < 0) {
              i.Readcount = 1;
              root.items.push(i);
            } else {
              root.items[index].Readcount = root.items[index].Readcount + 1;
            }
          }
        }
      );

      Timer = setInterval(() => {
        if (root.items.length > 0) {
          if (ItemCount != root.items.length) {
            ItemCount = root.items.length;
          } else {
            root.onReadStop();
          }
        }
      }, 2000);
    }
  }

  onReadStop() {
    try {
      clearInterval(Timer);
      this.isReading = false;
      this.loading = true;
      this.hubConnectionBuilder
        .stop()
        .then(() => console.log('Connection closed.......!'))
        .catch((err) =>
          this.messageService.add({
            severity: 'error',
            detail: 'Error while connect with server. Please try again',
          })
        );
      var root = this;

      var promise = new Promise(async function (resolve, reject) {
        await root.getItemInformations();
        resolve(0);
      }).then(function () {
        setTimeout(function () {
          root.groupItemInformation();
          root.loading = false;
          root.isResultReady = true;
        }, 500);
      });
    } catch (e) {
      this.messageService.add({
        severity: 'error',
        detail: 'Please check reader settings',
      });
      console.log(e);
      this.loading = false;
      this.isResultReady = true;
    }
  }

  getItemInformations() {
    this.enableSubmit = true;
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
          this.items[i].Status = this.tagModel.Status;
          this.items[i].Description =
            this.tagModel.Name +
            ' ' +
            this.tagModel.Category +
            ' ' +
            this.tagModel.Type;

          if (
            this.items[i].Status == 'Unrecognized' ||
            this.items[i].Status.indexOf('Checkin') >= 0
          ) {
            this.enableSubmit = false;
          }
        },
      });
    }
  }

  groupItemInformation() {
    this.formGroup.patchValue({ Tag: Tags });

    for (let i = 0; i < this.items.length; i++) {
      var index = this.groupItems.findIndex(
        (x) => x.Itemname === this.items[i].Itemname
      );
      if (index < 0) {
        var itm = new AssetModel();
        itm.Itemname = this.items[i].Itemname;
        itm.Category = this.items[i].Category;
        itm.Type = this.items[i].Type;
        itm.Description = this.items[i].Description;
        itm.Status = this.items[i].Status;
        itm.Readcount = 1;
        itm.IsSelected = true;
        itm.Tag = this.items[i].Tag;
        this.groupItems.push(itm);
      } else {
        this.groupItems[index].Readcount = this.groupItems[index].Readcount + 1;
      }
    }
  }

  onRemoveItem(rfid: string) {
    this.items = this.items.filter((tag) => tag.Tag !== rfid);
  }

  onClearItems() {
    this.items = [];
    Tags = '';
    this.groupItems = [];
    this.isResultReady = false;
    this.enableSubmit = false;
  }

  addRemoveItem = (tag: string, event: any) => {
    let isAllUnSelect = true;
    this.enableSubmit = true;
    this.groupItems.map((t) => {
      if (t.Tag === tag) t.IsSelected = !t.IsSelected;
      if (
        (t.Status == 'Unrecognized' || t.Status.indexOf('Checkout') >= 0) &&
        t.IsSelected
      ) {
        this.enableSubmit = false;
      }
    });
    this.groupItems.map((t) => {
      if (t.IsSelected) {
        isAllUnSelect = false;
      }
    });
    if (isAllUnSelect) this.enableSubmit = false;
  };
}
