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
import { ReaderModel } from 'src/app/models/readerModel';
import { Router } from '@angular/router';
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
  selector: 'app-scanin',
  templateUrl: './scanitem.component.html',
  styleUrls: ['./scanitem.component.scss'],
})
export class ScanitemComponent implements OnInit {
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
  readerIp: string = '';
  readerModel: ReaderModel[] = [];
  private hubConnectionBuilder!: HubConnection;
  constructor(
    private readerService: ReaderService,
    private router: Router,
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

  ngOnInit(): void {
    this.readerService.getReaderByService('Scanitem').subscribe({
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

  onGetEmployeeDetails() {
    this.employeeService
      .getEmployeeByEmployeeId(this.formGroup.get('Employeeid')?.value)
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

  initForm() {
    this.formGroup = this.fb.group({
      Workorderid: new FormControl('', Validators.required),
      Employeename: new FormControl('', Validators.required),
      Employeeid: new FormControl('', Validators.required),
      Tag: new FormControl(''),
    });
  }

  onReadStart() {
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
    this.hubConnectionBuilder.on('ListenToData', (Ip: string, Tag: string) => {
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
    });

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
    this.enableSubmit = false;
    for (let i = 0; i < this.items.length; i++) {
      var tag = this.items[i].Tag;
      console.log(tag);
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

          if (this.items[i].Itemname != 'Unrecognized') {
            Tags = Tags + this.items[i].Tag + ',';
            this.enableSubmit = true;
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
    this.groupItems = [];
    Tags = '';
  }
}
