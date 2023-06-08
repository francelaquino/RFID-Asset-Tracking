import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TagService } from 'src/app/services/tag.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { TagModel } from 'src/app/models/tagmodel';
import { ActivatedRoute } from '@angular/router';
import { EmployeeModel } from 'src/app/models/employeeModel';
import { AssetModel } from 'src/app/models/assetModel';

declare var jQuery: any;

@Component({
  selector: 'app-editempployee',
  templateUrl: './editempployee.component.html',
  styleUrls: ['./editempployee.component.scss'],
  providers: [MessageService],
})
export class EditempployeeComponent implements OnInit {
  loading: boolean = false;
  tagModel!: TagModel;
  employeeModel!: EmployeeModel;
  formGroup!: FormGroup;
  isReading: boolean = false;
  items: AssetModel[] = [];
  response: any;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private tagService: TagService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = this.fb.group({
      Guid: new FormControl('', Validators.required),
      Firstname: new FormControl('', Validators.required),
      Middlename: new FormControl(''),
      Lastname: new FormControl('', Validators.required),
      Employeeid: new FormControl('', Validators.required),
      Email: new FormControl(''),
      Tag: new FormControl(''),
      Active: new FormControl(''),
      Updatedby: new FormControl(''),
    });

    this.getEmployeeDetails();
  }

  getEmployeeDetails() {
    var Id = this.ActivatedRoute.snapshot.paramMap.get('id');

    if (Id != null) {
      this.loading = true;
      setTimeout(() => {
        this.employeeService.getEmployeeById(Id!).subscribe({
          next: (r) => (this.employeeModel = r),
          error: (e) => {
            this.loading = false;
            this.messageService.add({ severity: 'error', detail: e });
          },
          complete: () => {
            this.formGroup.patchValue({
              Guid: this.employeeModel.Guid,
              Firstname: this.employeeModel.Firstname,
              Lastname: this.employeeModel.Lastname,
              Middlename: this.employeeModel.Middlename,
              Email: this.employeeModel.Email,
              Employeeid: this.employeeModel.Employeeid,
              Tag: this.employeeModel.Tag,
              Active: this.employeeModel.Active,
            });
            this.loading = false;
          },
        });
      }, 500);
    }
  }

  onReadStart() {
    this.isReading = true;
    var root = this;

    (function ($) {
      $(document).ready(function () {
        $.getScript(
          'https://cdnjs.cloudflare.com/ajax/libs/signalr.js/2.4.1/jquery.signalR.min.js',
          function () {
            $.getScript('http://localhost:5500/signalr/hubs', function () {
              $.connection.hub.url = 'http://localhost:5500/signalr';

              var chat = $.connection.ConnectionHub;

              chat.client.ListenToData = function (message: string) {
                root.formGroup.patchValue({
                  Tag: message,
                });
              };

              $.connection.hub.start().done(function () {
                chat.server.startReading('localhost');
              });
            });
          }
        );
      });
    })(jQuery);
  }

  onReadStop() {
    this.isReading = false;
    (function ($) {
      $.connection.hub.stop();
    })(jQuery);
  }

  async onSubmit() {
    if (!this.formGroup.valid) {
      this.messageService.add({
        severity: 'error',
        detail: 'Please fill required fields!',
      });
    } else {
      this.loading = true;
      var tag = this.formGroup.get('Tag')?.value;
      var id = this.formGroup.get('Guid')?.value;
      this.tagService.checkTagIfExist(tag, id).subscribe({
        next: (r) => (this.tagModel = r),
        error: (e) => {
          this.loading = false;
          this.messageService.add({ severity: 'error', detail: e });
        },
        complete: () => {
          if (this.tagModel.Tag == '') {
            this.updateEmployee();
          } else if (
            this.tagModel.Tag != '' &&
            this.employeeModel.Guid == this.tagModel.Id
          ) {
            this.updateEmployee();
          } else {
            this.messageService.add({
              severity: 'info',
              detail: 'Tag already exist!',
            });
            this.loading = false;
          }
        },
      });
    }
  }

  updateEmployee() {
    this.formGroup.patchValue({
      Updatedby: localStorage.getItem('Username'),
    });
    this.employeeService.updateEmployee(this.formGroup.value).subscribe({
      next: (r) => (this.response = r.body),
      error: (e) => {
        this.messageService.add({ severity: 'error', detail: e });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        var r = this.response.StatusMessage;
        if (r.indexOf('exist!') == -1) {
          this.messageService.add({ severity: 'info', detail: r });
        } else {
          this.messageService.add({ severity: 'error', detail: r });
        }
      },
    });
  }
}
