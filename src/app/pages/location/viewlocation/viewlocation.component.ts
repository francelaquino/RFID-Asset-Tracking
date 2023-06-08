import { Component, OnInit } from '@angular/core';
import { LocationModel } from 'src/app/models/locationModel';
import { UtilityService } from 'src/app/services/utility.service';
import { ConfirmationService } from 'primeng/api'
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-viewlocation',
  templateUrl: './viewlocation.component.html',
  styleUrls: ['./viewlocation.component.scss'],
  providers: [MessageService]
})

export class ViewlocationComponent implements OnInit {

  items: LocationModel[] = [];
  locationModel!: LocationModel;
  loading: boolean = false;
  response !: any;

  constructor(private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService, private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.loading = true;
    this.utilityService.getLocations().subscribe(data => { this.items = data; this.loading = false; });


  }

  onAddnewLocation(){
    this.router.navigate(['/settings/newlocation']);
  }
  onDelete(Id: string) {
    let root = this;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete the location?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        var locationModel = new LocationModel;

        locationModel.Guid = Id;
        this.utilityService.deleteLocation(locationModel).subscribe({
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

