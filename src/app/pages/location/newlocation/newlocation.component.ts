import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UtilityService } from 'src/app/services/utility.service';
import { LocationModel } from 'src/app/models/locationModel';

@Component({
  selector: 'app-newlocation',
  templateUrl: './newlocation.component.html',
  styleUrls: ['./newlocation.component.scss'],
  providers: [MessageService],
})
export class NewlocationComponent implements OnInit {
  loading: boolean = false;
  locationModel!: LocationModel;
  formGroup!: FormGroup;
  response!: any;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private utilityService: UtilityService
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  initForm() {
    this.formGroup = this.fb.group({
      Location: new FormControl('', Validators.required),
      Active: new FormControl('', Validators.required),
      Description: new FormControl(''),
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
      this.utilityService.addLocation(this.formGroup.value).subscribe({
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
      Location: '',
      Description: '',
      Active: '',
    });

    this.formGroup.reset();
  }
}
