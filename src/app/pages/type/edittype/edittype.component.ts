import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UtilityService } from 'src/app/services/utility.service';
import { TypeModel } from 'src/app/models/typeModel';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edittype',
  templateUrl: './edittype.component.html',
  styleUrls: ['./edittype.component.scss'],
  providers: [MessageService],
})
export class EdittypeComponent implements OnInit {
  loading: boolean = false;
  typeModel!: TypeModel;
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
      Type: new FormControl('', Validators.required),
      Active: new FormControl('', Validators.required),
      Description: new FormControl(''),
      Updatedby: new FormControl(''),
    });

    this.getTypeDetails();
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
      this.utilityService.updateType(this.formGroup.value).subscribe({
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

  getTypeDetails() {
    var Id = this.ActivatedRoute.snapshot.paramMap.get('id');

    if (Id != null) {
      this.loading = true;
      setTimeout(() => {
        this.utilityService.getTypeById(Id!).subscribe({
          next: (r) => (this.typeModel = r),
          error: (e) => {
            this.loading = false;
            this.messageService.add({ severity: 'error', detail: e });
          },
          complete: () => {
            this.formGroup.patchValue({
              Guid: this.typeModel.Guid,
              Type: this.typeModel.Type,
              Active: this.typeModel.Active,
              Description: this.typeModel.Description,
            });
            this.loading = false;
          },
        });
      }, 500);
    }
  }
  onClear() {
    this.formGroup.patchValue({
      Type: '',
      Description: '',
      Active: '',
    });

    this.formGroup.reset();
  }
}
