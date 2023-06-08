
import { Component, OnInit } from '@angular/core';
import { ReaderModel } from 'src/app/models/readerModel';
import { ReaderService } from 'src/app/services/reader.service';
import { ConfirmationService } from 'primeng/api'
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-viewreader',
  templateUrl: './viewreader.component.html',
  styleUrls: ['./viewreader.component.scss'],
  providers: [MessageService]
})

export class ViewreaderComponent implements OnInit {

  items: ReaderModel[] = [];
  readerModel!: ReaderModel;
  loading: boolean = false;
  response !: any;

  constructor(private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService, private readerService: ReaderService) { }

  ngOnInit(): void {
    this.loading = true;
    this.readerService.getReaders().subscribe(data => { this.items = data; this.loading = false; });


  }

  onAddnewReader(){
    this.router.navigate(['/settings/newreader']);
  }
  onDelete(Id: string) {
    let root = this;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete the reader?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        var readerModel = new ReaderModel;

        readerModel.Guid = Id;
        this.readerService.deleteReader(readerModel).subscribe({
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

