
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageService } from 'primeng/api';
import { StationService } from 'src/app/services/station.service';
import { StationModel } from 'src/app/models/stationModel';
import { ActivatedRoute } from "@angular/router";
import { LookupModel } from 'src/app/models/lookupModel';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-editstation',
  templateUrl: './editstation.component.html',
  styleUrls: ['./editstation.component.scss']
})
export class EditstationComponent implements OnInit {

  loading: boolean = false;
  stationModel !: StationModel;
  formGroup !: FormGroup;
  response !: any;
  lookupReader:LookupModel[]=[];

  constructor(private lookupService: LookupService, private ActivatedRoute: ActivatedRoute, private fb: FormBuilder, private messageService: MessageService, private stationService: StationService) {
    this.initForm();

  }

  ngOnInit(): void {
    this.lookupService.getReaders().subscribe({next: (r) =>  this.lookupReader = r })
  }

  initForm() {
    this.formGroup = this.fb.group({
      Guid: new FormControl('', Validators.required),
      Station: new FormControl('', Validators.required),
      Reader: new FormControl('', Validators.required),
      Active: new FormControl('', Validators.required),
    });

    this.getStationDetails();

  }

  async onSubmit() {

    if (!this.formGroup.valid) {
      this.messageService.add({ severity: 'error', detail: 'Please fill required fields!' });
    } else {

      this.loading = true;


            this.stationService.updateStation(this.formGroup.value).subscribe({
              next: (r) => this.response = r.body,
              error: (e) => {
                this.messageService.add({ severity: 'error', detail: e })
                this.loading = false;
              },
              complete: () => {
                this.loading = false;
                var r = this.response.StatusMessage;
                if (r.indexOf("exist!") == -1) {
                    this.messageService.add({ severity: 'info', detail: r });
                }else{
                  this.messageService.add({ severity: 'error', detail: r });
                }
              }
            });


        


    }
  }

  getStationDetails() {

    var Id = this.ActivatedRoute.snapshot.paramMap.get("id");

    if (Id != null) {
      this.loading = true;
      setTimeout(() => {

        this.stationService.getStationById(Id!).subscribe({
          next: (r) => this.stationModel = r,
          error: (e) => {
            this.loading = false;
            this.messageService.add({ severity: 'error', detail: e })
          },
          complete: () => {
            this.formGroup.patchValue({
              Guid: this.stationModel.Guid,
              Station: this.stationModel.Station,
              Reader: this.stationModel.Reader,
              Active: this.stationModel.Active,
            })
            this.loading = false;
          }
        });

      }, 500);
    }
  }
  onClear() {


    this.formGroup.patchValue({
      Station: "",
      Description: "",
      Active: ""
    });

    this.formGroup.reset();

  }

}


