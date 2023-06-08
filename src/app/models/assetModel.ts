export class AssetModel {
  Id!: string;
  Guid!: string;
  Tag!: string;
  Itemname!: string;
  Type!: string;
  Category!: string;
  Manufacturer!: string;
  Location!: string;
  Model!: string;
  Description!: string;
  Active!: string;
  Updatedby!: string;
  Dateupdated!: string;
  Datecreated!: string;
  Createdby!: string;
  Readcount!: number;
  Status!: string;
  IsAllowedToGoOut!: string;
  AssetImagePath!: string;
  AssetImage!: string;
  IsSelected?: boolean;
}
