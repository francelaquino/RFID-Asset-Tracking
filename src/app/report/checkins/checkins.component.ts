
import { Component, OnInit } from '@angular/core';
import { logsModel } from 'src/app/models/logsModel';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-checkins',
  templateUrl: './checkins.component.html',
  styleUrls: ['./checkins.component.scss']
})

export class CheckinsComponent implements OnInit {

  items:logsModel[]=[];
  
  constructor(private utilityService:UtilityService) { }

  ngOnInit(): void {
    
    this.utilityService.getTransactions().subscribe(data => this.items = data);


  }

}
