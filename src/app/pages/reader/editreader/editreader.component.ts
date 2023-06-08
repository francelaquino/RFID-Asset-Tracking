import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ReaderService } from 'src/app/services/reader.service';
import { ReaderModel } from 'src/app/models/readerModel';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editreader',
  templateUrl: './editreader.component.html',
  styleUrls: ['./editreader.component.scss'],
})
export class EditreaderComponent implements OnInit {
  loading: boolean = false;
  readerModel!: ReaderModel;
  formGroup!: FormGroup;
  response!: any;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private readerService: ReaderService
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  initForm() {
    this.formGroup = this.fb.group({
      Guid: new FormControl('', Validators.required),
      Readername: new FormControl('', Validators.required),
      Ipaddress: new FormControl('', Validators.required),
      ReaderIpaddress: new FormControl('', Validators.required),
      Port: new FormControl(''),
      Active: new FormControl('', Validators.required),
      Scanin: new FormControl(false, Validators.required),
      Scanout: new FormControl(false, Validators.required),
      Assigntowo: new FormControl(false, Validators.required),
      Checkout: new FormControl(false, Validators.required),
      Checkin: new FormControl(false, Validators.required),
      Scanitem: new FormControl(false, Validators.required),
      Updatedby: new FormControl(''),
    });

    this.getReaderDetails();
  }

  async onSubmit() {
    if (!this.formGroup.valid) {
      this.messageService.add({
        severity: 'error',
        detail: 'Please fill required fields!',
      });
    } else {
      this.loading = true;

      this.formGroup.patchValue({
        Updatedby: localStorage.getItem('Username'),
      });
      this.readerService.updateReader(this.formGroup.value).subscribe({
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

  getReaderDetails() {
    var Id = this.ActivatedRoute.snapshot.paramMap.get('id');

    if (Id != null) {
      this.loading = true;
      setTimeout(() => {
        this.readerService.getReaderById(Id!).subscribe({
          next: (r) => (this.readerModel = r),
          error: (e) => {
            this.loading = false;
            this.messageService.add({ severity: 'error', detail: e });
          },
          complete: () => {
            this.formGroup.patchValue({
              Guid: this.readerModel.Guid,
              Readername: this.readerModel.Readername,
              Ipaddress: this.readerModel.Ipaddress,
              ReaderIpaddress: this.readerModel.ReaderIpaddress,
              Port: this.readerModel.Port,
              Active: this.readerModel.Active,
              Scanin: this.readerModel.Scanin,
              Scanout: this.readerModel.Scanout,
              Assigntowo: this.readerModel.Assigntowo,
              Checkout: this.readerModel.Checkout,
              Checkin: this.readerModel.Checkin,
              Scanitem: this.readerModel.Scanitem,
            });
            this.loading = false;
          },
        });
      }, 500);
    }
  }
}
