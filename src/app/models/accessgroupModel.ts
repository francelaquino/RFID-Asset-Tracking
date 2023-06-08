export class AccessGroupListModel {
  Id!: string;
  Module!: string;
  Action: AccessActionModel[] = [];
}

export class AccessActionModel {
  ActionName: string = '';
  IsAllowed: boolean = false;
  Id!: string;
}

export class AccessGroupModel {
  Id: string = '';
  AccessGroupName: string = '';
}

export class AccessGroupListModelDTO {
  Id?: string;
  Action?: AccessGroupListModel;
}

export class AccessGroupCheckList {
  Id!: string;
  AccessId!: string;
  AccessGroupId!: string;
}

export class AccessGroupDTO {
  Id: string = '';
  AccessGroupName: string = '';
  IsMember?: Boolean;
}

export class UserAccessDTO {
  UserId: string = '';
  Access: string = '';
}
