import { Component, OnInit } from '@angular/core';
import { TypeModel } from 'src/app/models/typeModel';
import { UtilityService } from 'src/app/services/utility.service';
import { ConfirmationService } from 'primeng/api'
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-viewtype',
  templateUrl: './viewtype.component.html',
  styleUrls: ['./viewtype.component.scss'],
  providers: [MessageService]
})

export class ViewtypeComponent implements OnInit {

  items: TypeModel[] = [];
  typeModel!: TypeModel;
  loading: boolean = false;
  response !: any;

  constructor(private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService, private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.loading = true;
    this.utilityService.getTypes().subscribe(data => { this.items = data; this.loading = false; });


  }

  onAddnewType(){
    this.router.navigate(['/settings/newtype']);
  }
  onDelete(Id: string) {
    let root = this;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete the type?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        var typeModel = new TypeModel;

        typeModel.Guid = Id;
        this.utilityService.deleteType(typeModel).subscribe({
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

