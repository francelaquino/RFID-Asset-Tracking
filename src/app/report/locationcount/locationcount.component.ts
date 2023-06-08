import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { LocationModel } from 'src/app/models/locationModel';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-locationcount',
  templateUrl: './locationcount.component.html',
  styleUrls: ['./locationcount.component.scss'],
})
export class LocationcountComponent implements OnInit {
  items: LocationModel[] = [];
  loading: boolean = false;
  title: String = 'Location Count Report';
  currentDateTime: String = '';

  constructor(private reportServicervice: ReportService) {}

  ngOnInit(): void {
    this.currentDateTime = moment().format('MMMM D YYYY, h:mma');
    this.loading = true;
    this.reportServicervice.getLocationCountReport().subscribe((data) => {
      this.items = data;
      this.loading = false;
    });
  }

  onExportToExcel = () => {
    this.loading = true;
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Sheet1');

    worksheet.columns = [
      { header: 'Location', key: 'Location' },
      { header: 'Category', key: 'Category' },
      { header: 'Type', key: 'Type' },
      { header: 'Itemcount', key: 'Itemcount' },
    ];

    this.items.forEach((e) => {
      worksheet.addRow(
        {
          Location: e.Location,
          Category: e.Category,
          Type: e.Type,
          Itemcount: e.Itemcount,
        },
        'n'
      );
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'LocationCount.xlsx');
    });
    this.loading = false;
  };
}
