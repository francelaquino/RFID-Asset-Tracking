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
import { AssetModel } from 'src/app/models/assetModel';
declare var jQuery: any;

@Component({
  selector: 'app-registeremployee',
  templateUrl: './registeremployee.component.html',
  styleUrls: ['./registeremployee.component.scss'],
  providers: [MessageService],
})
export class RegisteremployeeComponent implements OnInit {
  loading: boolean = false;
  tagModel!: TagModel;
  formGroup!: FormGroup;
  isReading: boolean = false;
  items: AssetModel[] = [];
  response!: any;

  constructor(
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
      Firstname: new FormControl('', Validators.required),
      Middlename: new FormControl(''),
      Lastname: new FormControl('', Validators.required),
      Employeeid: new FormControl('', Validators.required),
      Email: new FormControl(''),
      Tag: new FormControl(''),
      Active: new FormControl('', Validators.required),
      Updatedby: new FormControl(''),
    });
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
      this.tagService.checkTagIfExist(tag, '').subscribe({
        next: (r) => (this.tagModel = r),
        error: (e) => {
          this.loading = false;
          this.messageService.add({ severity: 'error', detail: e });
        },
        complete: () => {
          if (this.tagModel.Tag == '') {
            this.formGroup.patchValue({
              Updatedby: localStorage.getItem('Username'),
            });
            this.employeeService.addEmployee(this.formGroup.value).subscribe({
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
                  this.onClear();
                } else {
                  this.messageService.add({ severity: 'error', detail: r });
                }
              },
            });
          }
        },
      });
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

              $.connection.hub.start().done(function () {});
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
  onClear() {
    this.formGroup.patchValue({
      Firstname: '',
      Middlename: '',
      Lastname: '',
      Email: '',
      Tag: '',
      Active: '',
    });

    this.formGroup.reset();
  }
}
