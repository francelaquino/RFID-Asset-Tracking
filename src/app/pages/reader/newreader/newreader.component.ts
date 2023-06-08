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
declare var jQuery: any;

@Component({
  selector: 'app-newreader',
  templateUrl: './newreader.component.html',
  styleUrls: ['./newreader.component.scss'],
  providers: [MessageService],
})
export class NewreaderComponent implements OnInit {
  loading: boolean = false;
  readerModel!: ReaderModel;
  formGroup!: FormGroup;
  response!: any;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private readerService: ReaderService
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  initForm() {
    this.formGroup = this.fb.group({
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

      this.readerService.addReader(this.formGroup.value).subscribe({
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
  }

  onClear() {
    this.formGroup.patchValue({
      Category: '',
      Description: '',
      Active: '',
      Scanin: false,
      Scanout: false,
      Assigntowo: false,
      Checkout: false,
      Checkin: false,
      Scanitem: false,
    });

    this.formGroup.reset();
  }
}
