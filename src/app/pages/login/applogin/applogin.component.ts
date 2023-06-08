import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LoginService } from 'src/app/services/login.service';
import { AccessService } from 'src/app/services/access.service';
import { ActivatedRoute } from '@angular/router';
import { LoginModel } from 'src/app/models/loginModel';
import { Router } from '@angular/router';
import { Idle } from '@ng-idle/core';
declare var jQuery: any;

@Component({
  selector: 'app-applogin',
  templateUrl: './applogin.component.html',
  styleUrls: ['./applogin.component.scss'],
})
export class ApploginComponent implements OnInit {
  loading: boolean = false;
  loginModel: LoginModel = new LoginModel();
  username!: any;
  name!: any;
  formGroup!: FormGroup;
  isReading: boolean = false;
  sessionModel!: LoginModel;

  constructor(
    private idle: Idle,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private loginService: LoginService,
    private accessService: AccessService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = this.fb.group({
      Username: new FormControl('', Validators.required),
      Password: new FormControl('', Validators.required),
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
      this.loginService.verifyLogin(this.formGroup.value).subscribe({
        next: (r) => {
          this.name = r?.Name;
          this.username = r?.Username;
        },
        error: (e) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            detail: 'Invalid username and/or wrong password',
          });
        },
        complete: () => {
          this.loading = false;
          if (this.username == '') {
            this.messageService.add({
              severity: 'error',
              detail: 'Invalid username and/or wrong password',
            });

            this.formGroup.setValue({ Username: '', Password: '' });
          } else {
            this.loginModel.Name = this.name;
            this.loginModel.Username = this.username;
            this.loginService.createSession(this.loginModel);

            this.idle.watch();
            this.Router.navigate(['home/dashboard']);
          }
        },
      });
    }
  }
}
