import { Component, OnInit } from '@angular/core';
import { TransactionModel } from 'src/app/models/transactionmodel';
import { AssetModel } from 'src/app/models/assetModel';
import { ReportService } from 'src/app/services/report.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-transactionreport',
  templateUrl: './transactionreport.component.html',
  styleUrls: ['./transactionreport.component.scss'],
})
export class TransactionreportComponent implements OnInit {
  items: TransactionModel[] = [];
  woitems: AssetModel[] = [];
  isOpenDialog: boolean = false;
  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService
      .getTransactionReport()
      .subscribe((data) => (this.items = data));
  }

  viewItems(Id: any, Status: any) {
    this.reportService
      .getTransactionItems(Id, Status)
      .subscribe((data) => (this.woitems = data));
    this.isOpenDialog = true;
  }
}
