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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editlocation',
  templateUrl: './editlocation.component.html',
  styleUrls: ['./editlocation.component.scss'],
  providers: [MessageService],
})
export class EditlocationComponent implements OnInit {
  loading: boolean = false;
  locationModel!: LocationModel;
  formGroup!: FormGroup;
  response!: any;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private utilityService: UtilityService
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  initForm() {
    this.formGroup = this.fb.group({
      Guid: new FormControl('', Validators.required),
      Location: new FormControl('', Validators.required),
      Active: new FormControl('', Validators.required),
      Description: new FormControl(''),
      Updatedby: new FormControl(''),
    });

    this.getLocationDetails();
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
      this.utilityService.updateLocation(this.formGroup.value).subscribe({
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

  getLocationDetails() {
    var Id = this.ActivatedRoute.snapshot.paramMap.get('id');

    if (Id != null) {
      this.loading = true;
      setTimeout(() => {
        this.utilityService.getLocationById(Id!).subscribe({
          next: (r) => (this.locationModel = r),
          error: (e) => {
            this.loading = false;
            this.messageService.add({ severity: 'error', detail: e });
          },
          complete: () => {
            this.formGroup.patchValue({
              Guid: this.locationModel.Guid,
              Location: this.locationModel.Location,
              Active: this.locationModel.Active,
              Description: this.locationModel.Description,
            });
            this.loading = false;
          },
        });
      }, 500);
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
