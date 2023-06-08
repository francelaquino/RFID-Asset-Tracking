import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
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
import { LookupModel } from 'src/app/models/lookupModel';
import { LookupService } from 'src/app/services/lookup.service';
import { AssetModel } from '../../../models/assetModel';

declare var jQuery: any;

@Component({
  selector: 'app-createitem',
  templateUrl: './createitem.component.html',
  styleUrls: ['./createitem.component.scss'],
  providers: [MessageService],
})
export class CreateitemComponent implements OnInit {
  loading: boolean = false;
  tagModel!: TagModel;
  formGroup!: FormGroup;
  lookupCategory: LookupModel[] = [];
  lookupType: LookupModel[] = [];
  lookupLocation: LookupModel[] = [];
  isReading: boolean = false;
  items: AssetModel[] = [];
  emptyImageUrl: string = '/assets/emptyImage.jpeg';
  imageUrl: String = '/assets/emptyImage.jpeg';
  file: any;
  response!: any;
  @ViewChild('browseImage') browseImage: ElementRef | undefined;
  constructor(
    private lookupService: LookupService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private tagService: TagService,
    private assetService: AssetService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getLookUp();
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
      Itemname: new FormControl('', Validators.required),
      Type: new FormControl('', Validators.required),
      Category: new FormControl('', Validators.required),
      Manufacturer: new FormControl(''),
      Location: new FormControl('00000000-0000-0000-0000-000000000000'),
      Model: new FormControl(''),
      Tag: new FormControl('', Validators.required),
      Active: new FormControl('', Validators.required),
      Description: new FormControl(''),
      IsAllowedToGoOut: new FormControl(false),
      ImageFile: new FormControl(null),
      AssetImagePath: new FormControl(''),
      AssetImage: new FormControl(''),
      Updatedby: new FormControl(''),
      CreateAnother: new FormControl(false),
    });
  }

  onReadStart() {
    this.isReading = true;

    var root = this;
    var i = new AssetModel();
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

              $.connection.hub.start().done(function () {});
            });
          }
        );
      });
    })(jQuery);
  }
  onRemoveItem(rfid: string) {
    this.items = this.items.filter((tag) => tag.Tag !== rfid);
  }

  onReadStop() {
    this.isReading = false;
    (function ($) {
      $.connection.hub.stop();
    })(jQuery);
  }

  async onSubmit() {
    if (!this.formGroup.valid) {
      this.messageService.add({
        severity: 'error',
        detail: 'Please fill required fields!',
      });
    } else {
      this.loading = true;
      this.formGroup.patchValue({
        Updatedby: localStorage.getItem('Username'),
      });
      this.assetService.addBulkAsset(this.formGroup.value).subscribe({
        next: (r) => (this.response = r.body),
        error: (e) => {
          this.messageService.add({ severity: 'error', detail: e });
          this.loading = false;
        },
        complete: () => {
          if (this.response.ResultCode == '101') {
            if (this.imageUrl != this.emptyImageUrl) {
              const formData = new FormData();
              formData.append('tag', this.formGroup.get('Tag')?.value);
              formData.append('file', this.formGroup.get('ImageFile')?.value);
              this.assetService.uploadAssetPicture(formData);
            }
            this.loading = false;
            this.messageService.add({
              severity: 'info',
              detail: 'Asset successfully added!',
            });
            if (this.formGroup.get('CreateAnother')?.value == true) {
              this.formGroup.patchValue({
                Tag: '',
              });
              $('#tag').trigger('focus');
            } else {
              this.onClear();
            }
          } else {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              detail: this.response.StatusMessage,
            });
          }
        },
      });
    }
  }

  onClear() {
    this.items = [];
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
    this.formGroup.reset();

    this.formGroup.patchValue({
      Type: '',
      Itemname: '',
      Category: '',
      Manufacturer: '',
      Model: '',
      Description: '',
      Location: '',
      Tag: '',
      Active: '',
      IsAllowedToGoOut: false,
      CeateAnother: false,
    });
    $('#file').val('');
    this.imageUrl = this.emptyImageUrl;
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
