import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-registeruser',
  templateUrl: './registeruser.component.html',
  styleUrls: ['./registeruser.component.scss'],
  providers: [MessageService],
})
export class RegisteruserComponent implements OnInit {
  formGroup!: FormGroup;
  loading: boolean = false;
  response!: any;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private userService: UserService
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  initForm() {
    this.formGroup = this.fb.group({
      Firstname: new FormControl('', Validators.required),
      Lastname: new FormControl('', Validators.required),
      Username: new FormControl('', Validators.required),
      Password: new FormControl('', Validators.required),
      Retypepassword: new FormControl('', Validators.required),
      Email: new FormControl(''),
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
      if (
        this.formGroup.get('Password')?.value !==
        this.formGroup.get('Retypepassword')?.value
      ) {
        this.messageService.add({
          severity: 'error',
          detail: 'Password mismatch',
        });
        return;
      }

      this.loading = true;
      this.formGroup.patchValue({
        Updatedby: localStorage.getItem('Username'),
      });
      this.userService.addUser(this.formGroup.value).subscribe({
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
      Firstname: '',
      Middlename: '',
      Lastname: '',
      Email: '',
      Username: '',
      Password: '',
      Retypepassword: '',
      Active: '',
    });

    this.formGroup.reset();
  }
}
