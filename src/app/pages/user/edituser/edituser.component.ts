import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from 'src/app/models/usermodel';

declare var jQuery: any;

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.scss'],
  providers: [MessageService],
})
export class EdituserComponent implements OnInit {
  loading: boolean = false;
  userModel!: UserModel;
  formGroup!: FormGroup;
  isReading: boolean = false;
  response: any;
  isOpenDialog: boolean = false;
  Password: string = '';
  Retypepassword: string = '';

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = this.fb.group({
      Guid: new FormControl('', Validators.required),
      Firstname: new FormControl('', Validators.required),
      Lastname: new FormControl('', Validators.required),
      Username: new FormControl('', Validators.required),
      Email: new FormControl(''),
      Password: new FormControl(''),
      Active: new FormControl('', Validators.required),
      Updatedby: new FormControl(''),
    });

    this.getUserDetails();
  }

  getUserDetails() {
    var Id = this.ActivatedRoute.snapshot.paramMap.get('id');

    if (Id != null) {
      this.loading = true;
      setTimeout(() => {
        this.userService.getUserById(Id!).subscribe({
          next: (r) => (this.userModel = r),
          error: (e) => {
            this.loading = false;
            this.messageService.add({ severity: 'error', detail: e });
          },
          complete: () => {
            this.formGroup.patchValue({
              Guid: this.userModel.Guid,
              Firstname: this.userModel.Firstname,
              Lastname: this.userModel.Lastname,
              Email: this.userModel.Email,
              Username: this.userModel.Username,
              Active: this.userModel.Active,
            });
            this.loading = false;
          },
        });
      }, 500);
    }
  }

  async onPasswordReset() {
    if (this.Password == '') {
      this.messageService.add({
        severity: 'error',
        detail: 'Please fill required fields!',
      });
      return;
    }

    if (this.Password != this.Retypepassword) {
      this.messageService.add({
        severity: 'error',
        detail: 'Password mismatch!',
      });

      return;
    }

    this.loading = true;
    this.formGroup.patchValue({
      Password: this.Password,
    });
    this.formGroup.patchValue({ Updatedby: localStorage.getItem('Username') });
    this.userService.resetPassword(this.formGroup.value).subscribe({
      next: (r) => (this.response = r.body),
      error: (e) => {
        this.messageService.add({ severity: 'error', detail: e });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.isOpenDialog = false;
        var r = this.response.StatusMessage;
        if (r.indexOf('exist!') == -1) {
          this.messageService.add({ severity: 'info', detail: r });
        } else {
          this.messageService.add({ severity: 'error', detail: r });
        }
      },
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
      this.updateEmployee();
      this.loading = false;
    }
  }

  onOpenDialog() {
    this.Password = '';
    this.Retypepassword = '';
    this.isOpenDialog = true;
  }

  updateEmployee() {
    this.formGroup.patchValue({ Updatedby: localStorage.getItem('Username') });
    console.log(this.formGroup);
    this.userService.updateUser(this.formGroup.value).subscribe({
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
