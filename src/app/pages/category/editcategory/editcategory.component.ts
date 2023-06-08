import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UtilityService } from 'src/app/services/utility.service';
import { CategoryModel } from 'src/app/models/categoryModel';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editcategory',
  templateUrl: './editcategory.component.html',
  styleUrls: ['./editcategory.component.scss'],
  providers: [MessageService],
})
export class EditcategoryComponent implements OnInit {
  loading: boolean = false;
  categoryModel!: CategoryModel;
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
      Category: new FormControl('', Validators.required),
      Active: new FormControl('', Validators.required),
      Updatedby: new FormControl(''),
      Description: new FormControl(''),
    });

    this.getCategoryDetails();
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
      this.utilityService.updateCategory(this.formGroup.value).subscribe({
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

  getCategoryDetails() {
    var Id = this.ActivatedRoute.snapshot.paramMap.get('id');

    if (Id != null) {
      this.loading = true;
      setTimeout(() => {
        this.utilityService.getCategoryById(Id!).subscribe({
          next: (r) => (this.categoryModel = r),
          error: (e) => {
            this.loading = false;
            this.messageService.add({ severity: 'error', detail: e });
          },
          complete: () => {
            this.formGroup.patchValue({
              Guid: this.categoryModel.Guid,
              Category: this.categoryModel.Category,
              Active: this.categoryModel.Active,
              Description: this.categoryModel.Description,
            });
            this.loading = false;
          },
        });
      }, 500);
    }
  }
  onClear() {
    this.formGroup.patchValue({
      Category: '',
      Description: '',
      Active: '',
    });

    this.formGroup.reset();
  }
}
