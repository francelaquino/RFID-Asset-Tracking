
import { Component, OnInit } from '@angular/core';
import { StationModel } from 'src/app/models/stationModel';
import { StationService } from 'src/app/services/station.service';
import { ConfirmationService } from 'primeng/api'
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-viewstation',
  templateUrl: './viewstation.component.html',
  styleUrls: ['./viewstation.component.scss'],
  providers: [MessageService]
})

export class ViewstationComponent implements OnInit {

  items: StationModel[] = [];
  stationModel!: StationModel;
  loading: boolean = false;
  response !: any;

  constructor(private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService, private stationService: StationService) { }

  ngOnInit(): void {
    this.loading = true;
    this.stationService.getStations().subscribe(data => { this.items = data; this.loading = false; });


  }

  onAddnewStation(){
    this.router.navigate(['/settings/newstation']);
  }
  onDelete(Id: string) {
    let root = this;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete the station?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        var stationModel = new StationModel;

        stationModel.Guid = Id;
        this.stationService.deleteStation(stationModel).subscribe({
          next: (r) => this.response = r.body,
          error: (e) => {
            this.messageService.add({ severity: 'error', detail: e })

          },
          complete: () => {

            this.loading = false;
            var r = this.response.StatusMessage;
            this.messageService.add({ severity: 'info', detail: r });
            root.ngOnInit();

          }
        });




      }

    })
  }


}

