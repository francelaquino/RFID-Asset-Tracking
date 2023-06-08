import { Component, OnInit } from '@angular/core';
import { CategoryModel } from 'src/app/models/categoryModel';
import { UtilityService } from 'src/app/services/utility.service';
import { ConfirmationService } from 'primeng/api'
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-viewcategory',
  templateUrl: './viewcategory.component.html',
  styleUrls: ['./viewcategory.component.scss'],
  providers: [MessageService]
})

export class ViewcategoryComponent implements OnInit {

  items: CategoryModel[] = [];
  categoryModel!: CategoryModel;
  loading: boolean = false;
  response !: any;

  constructor(private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService, private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.loading = true;
    this.utilityService.getCategories().subscribe(data => { this.items = data; this.loading = false; });


  }

  onAddnewCategory(){
    this.router.navigate(['/settings/newcategory']);
  }
  onDelete(Id: string) {
    let root = this;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete the category?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        var categoryModel = new CategoryModel;

        categoryModel.Guid = Id;
        this.utilityService.deleteCategory(categoryModel).subscribe({
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

