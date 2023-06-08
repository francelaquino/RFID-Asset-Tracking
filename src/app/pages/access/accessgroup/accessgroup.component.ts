import { Component, OnInit } from '@angular/core';
import {
  AccessActionModel,
  AccessGroupListModel,
} from 'src/app/models/accessgroupModel';

@Component({
  selector: 'app-accessgroup',
  templateUrl: './accessgroup.component.html',
  styleUrls: ['./accessgroup.component.scss'],
})
export class AccessgroupComponent implements OnInit {
  accessGroupList: AccessGroupListModel[] = [];
  accessGroup: AccessGroupListModel = new AccessGroupListModel();
  accessAction: AccessActionModel = new AccessActionModel();
  constructor() {}
  ngOnInit(): void {
    this.accessAction.ActionName = 'New Asset';
    this.accessGroup.Id = '1';
    this.accessGroup.Action.push(this.accessAction);

    this.accessGroupList.push(this.accessGroup);

    this.accessAction.ActionName = 'Search Asset';
    this.accessGroup.Id = '2';
    this.accessGroup.Action.push(this.accessAction);

    this.accessGroupList.push(this.accessGroup);

    console.log(this.accessGroupList);
  }
}
