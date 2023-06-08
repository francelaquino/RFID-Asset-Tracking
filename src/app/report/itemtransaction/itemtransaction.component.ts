import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { TransactionModel } from 'src/app/models/transactionmodel';
import { MessageService } from 'primeng/api';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from 'moment';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-itemtransaction',
  templateUrl: './itemtransaction.component.html',
  styleUrls: ['./itemtransaction.component.scss'],
  providers: [MessageService],
})
export class ItemtransactionComponent implements OnInit {
  items: TransactionModel[] = [];
  loading: boolean = false;
  title: String = 'Item Transaction Report';
  currentDateTime: String = '';
  isOpenFilter: boolean = false;
  formGroup!: FormGroup;
  constructor(
    private reportServicervice: ReportService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.currentDateTime = moment().format('MMMM D YYYY, h:mma');
    // this.loading = true;
    // this.reportServicervice.getItemTransactionReport().subscribe((data) => {
    //   this.items = data;
    //   this.loading = false;
    // });

    this.initForm();
    this.onSearch();
  }

  initForm() {
    this.formGroup = this.fb.group({
      DateFrom: new FormControl(
        moment().subtract(10, 'days').format('d-MMM-YYYY'),
        Validators.required
      ),
      DateTo: new FormControl(
        moment().format('d-MMM-YYYY'),
        Validators.required
      ),
      AssetNo: new FormControl(''),
      Mode: new FormControl(''),
      Employee: new FormControl(''),
    });
  }

  openFilter() {
    this.isOpenFilter = true;
  }

  onClear = () => {
    this.formGroup.patchValue({
      DateFrom: moment().subtract(10, 'days').format('d-MMM-YYYY'),
      DateTo: moment().format('d-MMM-YYYY'),
      AssetNo: '',
      Mode: '',
      Employee: '',
    });
    this.formGroup.reset();
  };
  onSearch = () => {
    if (!this.formGroup.valid) return;
    this.loading = true;
    this.reportServicervice
      .getItemTransactionReport(this.formGroup.value)
      .subscribe({
        next: (r) => {
          if (r.body != null) {
            this.items = r.body;
          }
        },
        error: (e) => {
          this.messageService.add({ severity: 'error', detail: e });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
          this.isOpenFilter = false;
        },
      });
  };

  onClearFilter() {
    this.onClear();
    this.onSearch();
  }
  onExportToExcel = () => {
    this.loading = true;
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Sheet1');

    worksheet.columns = [
      { header: 'Date Created', key: 'DateCreated' },
      { header: 'Workorder No.', key: 'WorkorderNo' },
      { header: 'Asset No.', key: 'AssetNo' },
      { header: 'Item Name', key: 'ItemName' },
      { header: 'Type', key: 'Type' },
      { header: 'Category', key: 'Category' },
      { header: 'Mode', key: 'Mode' },
      { header: 'Employee', key: 'Employee' },
    ];

    this.items.forEach((e) => {
      worksheet.addRow(
        {
          DateCreated: e.DateCreated,
          WorkorderNo: e.WorkorderNo,
          AssetNo: e.AssetNo,
          ItemName: e.ItemName,
          Type: e.Type,
          Category: e.Category,
          Mode: e.Mode,
          Employee: e.Employee,
        },
        'n'
      );
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'Transactions.xlsx');
    });
    this.loading = false;
  };
}
