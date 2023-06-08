import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AssetModel } from 'src/app/models/assetModel';
import { ReportService } from 'src/app/services/report.service';
import { LookupService } from 'src/app/services/lookup.service';
import { LookupModel } from 'src/app/models/lookupModel';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-unavailableitem',
  templateUrl: './unavailableitem.component.html',
  styleUrls: ['./unavailableitem.component.scss'],
  providers: [MessageService],
})
export class UnavailableitemComponent implements OnInit {
  items: AssetModel[] = [];
  loading: boolean = false;
  title: String = 'Unavailable Asset Report';
  currentDateTime: String = '';
  isOpenFilter: boolean = false;
  formGroup!: FormGroup;
  lookupCategory: LookupModel[] = [];
  lookupType: LookupModel[] = [];
  lookupLocation: LookupModel[] = [];
  constructor(
    private messageService: MessageService,
    private reportServicervice: ReportService,
    private fb: FormBuilder,
    private lookupService: LookupService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getLookUp();
    this.currentDateTime = moment().format('MMMM D YYYY, h:mma');
    this.loading = true;

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

  getLookUp() {
    this.lookupService
      .getCategories()
      .subscribe({ next: (r) => (this.lookupCategory = r) });
    this.lookupService
      .getTypes()
      .subscribe({ next: (r) => (this.lookupType = r) });
    this.lookupService
      .getLocations()
      .subscribe({ next: (r) => (this.lookupLocation = r) });
  }

  initForm() {
    this.formGroup = this.fb.group({
      Id: new FormControl(''),
      Status: new FormControl(''),
      Itemname: new FormControl(''),
      Type: new FormControl('00000000-0000-0000-0000-000000000000'),
      Category: new FormControl('00000000-0000-0000-0000-000000000000'),
      Location: new FormControl('00000000-0000-0000-0000-000000000000'),
      Tag: new FormControl(''),
    });
  }

  onClear = () => {
    this.formGroup.patchValue({
      Id: '',
      Status: '',
      Itemname: '',
      Type: '00000000-0000-0000-0000-000000000000',
      Category: '00000000-0000-0000-0000-000000000000',
      Location: '00000000-0000-0000-0000-000000000000',
      Tag: '',
    });
  };

  onClearFilter() {
    this.onClear();
    this.onSearch();
  }

  onSearch = () => {
    if (!this.formGroup.valid) return;
    if (this.formGroup.get('Id')?.value == '') {
      this.formGroup.patchValue({
        Id: '0',
      });
    }
    this.loading = true;
    this.reportServicervice
      .getUnavailableAssetReport(this.formGroup.value)
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

  onExportToExcel = () => {
    this.loading = true;
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Sheet1');

    worksheet.columns = [
      { header: 'Asset No.', key: 'Id' },
      { header: 'Tag', key: 'Tag' },
      { header: 'Item Name', key: 'Itemname' },
      { header: 'Description', key: 'Description' },
      { header: 'Type', key: 'Type' },
      { header: 'Category', key: 'Category' },
      { header: 'Location', key: 'Location' },
      { header: 'Manufacturer', key: 'Manufacturer' },
      { header: 'Model', key: 'Model' },
      { header: 'IsAllowedToGoOut', key: 'IsAllowedToGoOut' },
      { header: 'Status', key: 'Status' },
      { header: 'Active', key: 'Active' },
      { header: 'Date Updated', key: 'Dateupdated' },
      { header: 'Updated By', key: 'Updatedby' },
      { header: 'Date Created', key: 'Datecreated' },
      { header: 'Created By', key: 'Createdby' },
    ];

    this.items.forEach((e) => {
      worksheet.addRow(
        {
          Id: e.Id,
          Tag: e.Tag,
          Itemname: e.Itemname,
          Description: e.Description,
          Type: e.Type,
          Category: e.Category,
          Location: e.Location,
          Manufacturer: e.Manufacturer,
          Model: e.Model,
          IsAllowedToGoOut: e.IsAllowedToGoOut,
          Status: e.Status,
          Active: e.Active,
          Dateupdated: e.Dateupdated,
          Updatedby: e.Updatedby,
          Datecreated: e.Datecreated,
          Createdby: e.Createdby,
        },
        'n'
      );
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'UnavailableAssets.xlsx');
    });
    this.loading = false;
  };
}
