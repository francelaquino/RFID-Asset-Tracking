import { Component, OnInit } from '@angular/core';
import { WorkorderModel } from 'src/app/models/workordermodel';
import { AssetModel } from 'src/app/models/assetModel';
import { WorkorderService } from 'src/app/services/workorder.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-viewworkorder',
  templateUrl: './viewworkorder.component.html',
  styleUrls: ['./viewworkorder.component.scss'],
})
export class ViewworkorderComponent implements OnInit {
  items: WorkorderModel[] = [];
  woitems: AssetModel[] = [];
  isOpenDialog: boolean = false;
  constructor(private workorderService: WorkorderService) {}

  ngOnInit(): void {
    this.workorderService.getWorkOrders().subscribe((data) => {
      this.items = data;
    });
  }

  viewItems(Id: any) {
    this.workorderService
      .getWorkOrderItems(Id)
      .subscribe((data) => (this.woitems = data));
    this.isOpenDialog = true;
  }
}
