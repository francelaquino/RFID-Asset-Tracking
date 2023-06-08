import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TagService } from 'src/app/services/tag.service';
import { AssetService } from 'src/app/services/asset.service';
import { TagModel } from 'src/app/models/tagmodel';
import { ActivatedRoute } from '@angular/router';
import { AssetModel } from 'src/app/models/assetModel';
import { LookupModel } from 'src/app/models/lookupModel';
import { LookupService } from 'src/app/services/lookup.service';

declare var jQuery: any;

@Component({
  selector: 'app-edititem',
  templateUrl: './edititem.component.html',
  styleUrls: ['./edititem.component.scss'],
  providers: [MessageService],
})
export class EdititemComponent implements OnInit {
  loading: boolean = false;
  tagModel!: TagModel;
  assetModel!: AssetModel;
  formGroup!: FormGroup;
  lookupCategory: LookupModel[] = [];
  lookupType: LookupModel[] = [];
  lookupLocation: LookupModel[] = [];
  isReading: boolean = false;
  items: AssetModel[] = [];
  emptyImageUrl: string = '/assets/emptyImage.jpeg';
  imageUrl: String = '/assets/emptyImage.jpeg';

  constructor(
    private lookupService: LookupService,
    private ActivatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private tagService: TagService,
    private assetService: AssetService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getLookUp();
  }

  initForm() {
    this.formGroup = this.fb.group({
      Guid: new FormControl('', Validators.required),
      Itemname: new FormControl('', Validators.required),
      Type: new FormControl('', Validators.required),
      Category: new FormControl('', Validators.required),
      Manufacturer: new FormControl(''),
      Model: new FormControl(''),
      Tag: new FormControl(''),
      Active: new FormControl(''),
      Location: new FormControl('00000000-0000-0000-0000-000000000000'),
      Description: new FormControl(''),
      ImageFile: new FormControl(null),
      IsAllowedToGoOut: new FormControl(''),
      Updatedby: new FormControl(''),
    });

    this.getItemDetails();
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

  onReadStart() {
    this.isReading = true;

    var root = this;
    (function ($) {
      $(document).ready(function () {
        $.getScript(
          'https://cdnjs.cloudflare.com/ajax/libs/signalr.js/2.4.1/jquery.signalR.min.js',
          function () {
            $.getScript('http://localhost:5500/signalr/hubs', function () {
              $.connection.hub.url = 'http://localhost:5500/signalr';

              var chat = $.connection.ConnectionHub;

              chat.client.ListenToData = function (message: string) {
                root.formGroup.patchValue({
                  Tag: message,
                });
              };

              $.connection.hub.start().done(function () {
                chat.server.startReading('localhost');
              });
            });
          }
        );
      });
    })(jQuery);
  }

  onReadStop() {
    this.isReading = false;
    (function ($) {
      $.connection.hub.stop();
    })(jQuery);
  }

  getItemDetails() {
    var Id = this.ActivatedRoute.snapshot.paramMap.get('id');

    if (Id != null) {
      this.loading = true;
      setTimeout(() => {
        this.assetService.getAssetById(Id!).subscribe({
          next: (r) => (this.assetModel = r),
          error: (e) => {
            this.loading = false;
            this.messageService.add({ severity: 'error', detail: e });
          },
          complete: () => {
            this.formGroup.patchValue({
              Guid: this.assetModel.Guid,
              Itemname: this.assetModel.Itemname,
              Type: this.assetModel.Type,
              Category: this.assetModel.Category,
              Manufacturer: this.assetModel.Manufacturer,
              Location: this.assetModel.Location,
              Model: this.assetModel.Model,
              Tag: this.assetModel.Tag,
              Active: this.assetModel.Active,
              Description: this.assetModel.Description,
              IsAllowedToGoOut: this.assetModel.IsAllowedToGoOut,
            });

            if (this.assetModel.AssetImage == '') {
              this.imageUrl = this.emptyImageUrl;
            } else {
              this.imageUrl =
                'data:image/jpg;base64,' + this.assetModel.AssetImage;
            }
            this.loading = false;
          },
        });
      }, 500);
    }
  }

  async onSubmit() {
    if (!this.formGroup.valid) {
      this.messageService.add({
        severity: 'error',
        detail: 'Please fill required fields!',
      });
    } else {
      this.loading = true;
      var tag = this.formGroup.get('Tag')?.value;
      var id = this.formGroup.get('Guid')?.value;
      this.tagService.checkTagIfExist(tag, id).subscribe({
        next: (r) => (this.tagModel = r),
        error: (e) => {
          this.loading = false;
          this.messageService.add({ severity: 'error', detail: e });
        },
        complete: () => {
          if (this.tagModel.Tag == '') {
            this.updateAsset();
          } else if (
            this.tagModel.Tag != '' &&
            this.assetModel.Guid == this.tagModel.Id
          ) {
            this.updateAsset();
          } else {
            this.messageService.add({
              severity: 'error',
              detail: 'Tag already exist!',
            });
            this.loading = false;
          }
        },
      });
    }
  }

  updateAsset() {
    const formData = new FormData();
    this.formGroup.patchValue({
      Updatedby: localStorage.getItem('Username'),
    });
    this.assetService.updateAsset(this.formGroup.value).subscribe({
      error: (e) => {
        this.messageService.add({ severity: 'error', detail: e });
        this.loading = false;
      },
      complete: () => {
        if (this.imageUrl != this.emptyImageUrl) {
          formData.append('tag', this.formGroup.get('Tag')?.value);
          formData.append('file', this.formGroup.get('ImageFile')?.value);
          this.assetService.uploadAssetPicture(formData);
        }

        this.loading = false;
        this.messageService.add({
          severity: 'info',
          detail: 'Asset successfully updated!',
        });
      },
    });
  }

  onImageChange(event: any) {
    var reader = new FileReader();

    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };

    reader.readAsDataURL(event.target.files[0]);

    this.formGroup.patchValue({
      ImageFile: event.target.files[0],
    });
  }
}
