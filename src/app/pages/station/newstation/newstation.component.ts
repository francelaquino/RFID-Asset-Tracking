
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageService } from 'primeng/api';
import { StationService } from 'src/app/services/station.service';
import { StationModel } from 'src/app/models/stationModel';
import { LookupModel } from 'src/app/models/lookupModel';
import { LookupService } from 'src/app/services/lookup.service';
declare var jQuery: any;

@Component({
  selector: 'app-newstation',
  templateUrl: './newstation.component.html',
  styleUrls: ['./newstation.component.scss'],
  providers: [MessageService]
})
export class NewstationComponent implements OnInit {

  loading: boolean = false;
  stationModel !: StationModel;
  formGroup !: FormGroup;
  response !: any;
  lookupReader:LookupModel[]=[];

  constructor(private lookupService: LookupService, private fb: FormBuilder, private messageService: MessageService, private stationService: StationService) {
    this.initForm();

  }

  ngOnInit(): void {

    this.lookupService.getReaders().subscribe({next: (r) =>  this.lookupReader = r })
  }

  initForm() {
    this.formGroup = this.fb.group({
      Station: new FormControl('', Validators.required),
      Reader: new FormControl('', Validators.required),
      Active: new FormControl('', Validators.required),
    });

  }

  async onSubmit() {

    if (!this.formGroup.valid) {
      this.messageService.add({ severity: 'error', detail: 'Please fill required fields!' });
    } else {

      this.loading = true;


            this.stationService.addStation(this.formGroup.value).subscribe({
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
                    this.onClear();
                }else{
                  this.messageService.add({ severity: 'error', detail: r });
                }
              }
            });


        


    }
  }

  onClear() {


    this.formGroup.patchValue({
      Category: "",
      Description: "",
      Active: ""
    });

    this.formGroup.reset();

  }

}


