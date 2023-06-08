import { Component, OnInit } from '@angular/core';
import { AssetModel } from '../../../models/assetModel';
import { AssetService } from '../../../services/asset.service';

@Component({
  selector: 'app-viewitem',
  templateUrl: './viewitem.component.html',
  styleUrls: ['./viewitem.component.scss'],
})
export class ViewitemComponent implements OnInit {
  items: AssetModel[] = [];

  constructor(private assetService: AssetService) {}

  ngOnInit(): void {
    this.assetService.getAssets().subscribe((data) => (this.items = data));
  }
}
