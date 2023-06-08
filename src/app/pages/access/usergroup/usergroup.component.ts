import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AccessGroupModel,
  AccessGroupDTO,
} from 'src/app/models/accessgroupModel';

import { MessageService } from 'primeng/api';
import { AccessService } from 'src/app/services/access.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { UserService } from 'src/app/services/user.service';
import { UserModel } from 'src/app/models/usermodel';

@Component({
  selector: 'app-usergroup',
  templateUrl: './usergroup.component.html',
  styleUrls: ['./usergroup.component.scss'],
})
export class UsergroupComponent implements OnInit {
  response: any;
  loading: boolean = false;
  groupList: AccessGroupDTO[] = [];
  formGroup!: FormGroup;
  userGroup: string[] = [];
  filteredUsers: string[] = [];
  users: string[] = [];
  access: string = '';

  constructor(
    private accessService: AccessService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private employeeService: EmployeeService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.formGroup = this.fb.group({
      UserId: new FormControl(''),
      Name: new FormControl(''),
      Access: new FormControl(''),
    });

    this.accessService.getAccessGroupDTO().subscribe((data) => {
      this.groupList = data;
      this.loading = false;
      console.log(this.groupList);
    });

    this.userService.getUsers().subscribe({
      next: (r) => {
        r.map((user) => {
          this.users.push(
            user.Username + ' - ' + user.Firstname + ' ' + user.Lastname
          );
        });
      },
    });
  }

  onGetEmployeeAccess() {
    this.accessService
      .getUserGroup(this.formGroup.get('UserId')?.value.split(' - ')[0])
      .subscribe((data) => {
        this.userGroup = data;
        this.groupList.forEach((a, index) => {
          this.groupList[index].IsMember = false;
          if (this.userGroup.findIndex((b) => b == a.Id) >= 0) {
            this.groupList[index].IsMember = true;
          }
        });
      });
  }
  filterUser = (event: any) => {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.users.length; i++) {
      let user = this.users[i];
      if (user.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        filtered.push(user);
      }
    }
    this.filteredUsers = filtered;
  };

  onAccessGroupChange(value: any) {
    var Id = value.target.value;

    // this.accessService.getAccessGroupCheckList(Id).subscribe((data) => {
    //   this.groupCheckList = data;

    //   this.accessGroupList.forEach((g, accessGroupIndex) => {
    //     var actions = this.accessGroupList[accessGroupIndex].Action;

    //     actions.forEach((b, actionIndex) => {
    //       var i = this.groupCheckList.findIndex((c) => c.AccessId == b.Id);
    //       if (i >= 0) {
    //         this.accessGroupList[accessGroupIndex].Action[
    //           actionIndex
    //         ].IsAllowed = true;
    //       } else {
    //         this.accessGroupList[accessGroupIndex].Action[
    //           actionIndex
    //         ].IsAllowed = false;
    //       }
    //     });
    //   });
    // });
  }

  onSave = () => {
    this.access = '';
    this.groupList.forEach((a) => {
      if (a.IsMember) {
        this.access = this.access + a.Id + ',';
      }
    });

    var userId = this.formGroup.get('UserId')?.value.split(' - ')[0];
    var name = this.formGroup.get('UserId')?.value.split(' - ')[1];
    this.formGroup.patchValue({
      Access: this.access,
      UserId: userId,
    });

    if (!this.formGroup.valid) {
      this.messageService.add({
        severity: 'error',
        detail: 'Please fill required fields!',
      });
    } else {
      this.loading = true;

      this.accessService.saveUserGroup(this.formGroup.value).subscribe({
        next: (r) => (this.response = r.body),
        error: (e) => {
          this.messageService.add({ severity: 'error', detail: e });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
          var r = this.response.StatusMessage;
          this.messageService.add({ severity: 'info', detail: r });
          this.formGroup.patchValue({
            UserId: userId + ' - ' + name,
          });
        },
      });
    }
  };

  onActionChange = (groupId: string, event: any) => {
    var groupIndex = this.groupList.findIndex((a) => a.Id === groupId);
    if (groupIndex >= 0) {
      this.groupList[groupIndex].IsMember = event.target.checked;
    }
  };
}
