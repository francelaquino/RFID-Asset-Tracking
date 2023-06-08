import { Component, OnInit } from '@angular/core';
import { AssetModel } from 'src/app/models/assetModel';
import { DashboardModel } from 'src/app/models/dashboardModel';
import { TransactionModel } from 'src/app/models/transactionmodel';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  dashboard: DashboardModel = new DashboardModel();
  items: AssetModel[] = [];
  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    var root = this;
    this.dashboard.ActiveWorkorder = '0';
    this.dashboard.AssignedItem = '0';
    this.dashboard.ItemINToday = '0';
    this.dashboard.ItemINTotal = '0';
    this.dashboard.ItemOutToday = '0';
    this.dashboard.ItemOutTotal = '0';
    this.dashboard.OneWeekOut = '0';

    root.reportService
      .getDashboardCount()
      .subscribe((data) => (root.dashboard = data));
    root.reportService
      .getLatestTransactionCheckout()
      .subscribe((data) => (root.items = data));
  }
}
