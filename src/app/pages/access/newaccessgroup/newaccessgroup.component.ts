import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  AccessActionModel,
  AccessGroupCheckList,
  AccessGroupListModel,
  AccessGroupModel,
} from 'src/app/models/accessgroupModel';
import { AccessService } from 'src/app/services/access.service';

@Component({
  selector: 'app-newaccessgroup',
  templateUrl: './newaccessgroup.component.html',
  styleUrls: ['./newaccessgroup.component.scss'],
  providers: [MessageService],
})
export class NewaccessgroupComponent implements OnInit {
  accessGroupList: AccessGroupListModel[] = [];
  accessGroup: AccessGroupListModel = new AccessGroupListModel();
  accessAction: AccessActionModel = new AccessActionModel();
  groupList: AccessGroupModel[] = [];
  groupCheckList: AccessGroupCheckList[] = [];
  response: any;
  loading: boolean = false;
  formGroup!: FormGroup;
  constructor(
    private accessService: AccessService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.loading = true;

    this.formGroup = this.fb.group({
      Id: new FormControl('', Validators.required),
      Action: new FormControl(new AccessActionModel()),
    });

    this.accessService.getAccessGroup().subscribe((data) => {
      this.groupList = data;
    });
    this.accessService.getAccessGroupList().subscribe((data) => {
      this.accessGroupList = data;
      this.loading = false;
    });
  }

  onActionChange = (module: string, event: any, ActionId: string) => {
    var accessGroupIndex = this.accessGroupList.findIndex(
      (a) => a.Module === module
    );

    var actionIndex = this.accessGroupList[accessGroupIndex].Action.findIndex(
      (a) => a.Id == ActionId
    );
    if (actionIndex >= 0) {
      this.accessGroupList[accessGroupIndex].Action[actionIndex].IsAllowed =
        event.target.checked;
    }
  };

  onAccessGroupChange(value: any) {
    var Id = value.target.value;

    this.accessService.getAccessGroupCheckList(Id).subscribe((data) => {
      this.groupCheckList = data;

      this.accessGroupList.forEach((g, accessGroupIndex) => {
        var actions = this.accessGroupList[accessGroupIndex].Action;

        actions.forEach((b, actionIndex) => {
          var i = this.groupCheckList.findIndex((c) => c.AccessId == b.Id);
          if (i >= 0) {
            this.accessGroupList[accessGroupIndex].Action[
              actionIndex
            ].IsAllowed = true;
          } else {
            this.accessGroupList[accessGroupIndex].Action[
              actionIndex
            ].IsAllowed = false;
          }
        });
      });
    });
  }

  onSave = () => {
    this.formGroup.patchValue({
      Action: this.accessGroupList,
    });

    if (!this.formGroup.valid) {
      this.messageService.add({
        severity: 'error',
        detail: 'Please fill required fields!',
      });
    } else {
      this.loading = true;

      this.accessService.saveAccessGroupList(this.formGroup.value).subscribe({
        next: (r) => (this.response = r.body),
        error: (e) => {
          this.messageService.add({ severity: 'error', detail: e });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
          var r = this.response.StatusMessage;
          this.messageService.add({ severity: 'info', detail: r });
        },
      });
    }
  };
}
