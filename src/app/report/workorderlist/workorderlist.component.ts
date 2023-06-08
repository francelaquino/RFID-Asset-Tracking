import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { WorkorderModel } from 'src/app/models/workordermodel';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-workorderlist',
  templateUrl: './workorderlist.component.html',
  styleUrls: ['./workorderlist.component.scss'],
})
export class WorkorderlistComponent implements OnInit {
  items: WorkorderModel[] = [];
  loading: boolean = false;
  title: String = 'Workorder Report';
  currentDateTime: String = '';
  isOpenFilter: boolean = false;
  formGroup!: FormGroup;

  constructor(
    private messageService: MessageService,
    private reportServicervice: ReportService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.currentDateTime = moment().format('MMMM D YYYY, h:mma');
    this.loading = true;

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
      Description: new FormControl(''),
      Employeename: new FormControl(''),
      Workorderid: new FormControl(''),
      Status: new FormControl(''),
    });
  }

  onClear = () => {
    this.formGroup.patchValue({
      DateFrom: moment().subtract(10, 'days').format('d-MMM-YYYY'),
      DateTo: moment().format('d-MMM-YYYY'),
      Description: '',
      Employeename: '',
      Workorderid: '',
      Status: '',
    });
  };

  onExportToExcel = () => {
    this.loading = true;
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Sheet1');

    worksheet.columns = [
      { header: 'Workorder No.', key: 'workorderid' },
      { header: 'Workorder Date', key: 'workorderdate' },
      { header: 'Date Created', key: 'DateCreated' },
      { header: 'Description', key: 'Description' },
      { header: 'Employeename', key: 'Employeename' },
      { header: 'Status', key: 'Status' },
    ];

    this.items.forEach((e) => {
      worksheet.addRow(
        {
          workorderid: e.Workorderid,
          workorderdate: e.Workorderdate,
          DateCreated: e.Datecreated,
          Description: e.Description,
          Employeename: e.Employeename,
          Status: e.Status,
        },
        'n'
      );
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'WorkOrders.xlsx');
    });
    this.loading = false;
  };

  onClearFilter() {
    this.onClear();
    this.onSearch();
  }

  openFilter() {
    if (this.formGroup.get('Id')?.value == '0') {
      this.formGroup.patchValue({
        Id: '',
      });
    }
    this.isOpenFilter = true;
  }
  onSearch = () => {
    if (!this.formGroup.valid) return;
    this.loading = true;
    this.reportServicervice
      .getWorkorderListReport(this.formGroup.value)
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
}
