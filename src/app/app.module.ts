import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgxLoadingModule } from 'ngx-loading';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CreateitemComponent } from './pages/item/createitem/createitem.component';
import { AssigntagComponent } from './pages/item/assigntag/assigntag.component';
import { ViewitemComponent } from './pages/item/viewitem/viewitem.component';
import { RegisteremployeeComponent } from './pages/employee/registeremployee/registeremployee.component';
import { EditempployeeComponent } from './pages/employee/editempployee/editempployee.component';
import { SearchemployeeComponent } from './pages/employee/searchemployee/searchemployee.component';
import { RegisteruserComponent } from './pages/user/registeruser/registeruser.component';
import { EdituserComponent } from './pages/user/edituser/edituser.component';
import { ViewuserComponent } from './pages/user/viewuser/viewuser.component';
import { ItemmainComponent } from './pages/item/itemmain/itemmain.component';
import { CreateworkorderComponent } from './pages/workorder/createworkorder/createworkorder.component';
import { ViewworkorderComponent } from './pages/workorder/viewworkorder/viewworkorder.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ToastModule } from 'primeng/toast';
import { EdititemComponent } from './pages/item/edititem/edititem.component';
import { CreatecategoryComponent } from './pages/category/createcategory/createcategory.component';
import { EditcategoryComponent } from './pages/category/editcategory/editcategory.component';
import { ViewcategoryComponent } from './pages/category/viewcategory/viewcategory.component';
import { NewtypeComponent } from './pages/type/newtype/newtype.component';
import { EdittypeComponent } from './pages/type/edittype/edittype.component';
import { ViewtypeComponent } from './pages/type/viewtype/viewtype.component';
import { NewreaderComponent } from './pages/reader/newreader/newreader.component';
import { EditreaderComponent } from './pages/reader/editreader/editreader.component';
import { ViewreaderComponent } from './pages/reader/viewreader/viewreader.component';
import { NewstationComponent } from './pages/station/newstation/newstation.component';
import { EditstationComponent } from './pages/station/editstation/editstation.component';
import { ViewstationComponent } from './pages/station/viewstation/viewstation.component';
import { CheckinsComponent } from './report/checkins/checkins.component';
import { CheckoutsComponent } from './report/checkouts/checkouts.component';
import { ApploginComponent } from './pages/login/applogin/applogin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CheckinComponent } from './pages/scan/checkin/checkin.component';
import { AssigntoworkorderComponent } from './pages/workorder/assigntoworkorder/assigntoworkorder.component';
import { NewlocationComponent } from './pages/location/newlocation/newlocation.component';
import { EditlocationComponent } from './pages/location/editlocation/editlocation.component';
import { ViewlocationComponent } from './pages/location/viewlocation/viewlocation.component';
import { WorkorderinquiryComponent } from './pages/workorder/workorderinquiry/workorderinquiry.component';
import { TransactionreportComponent } from './report/transactionreport/transactionreport.component';
import { IteminquiryComponent } from './pages/item/iteminquiry/iteminquiry.component';
import { ScanoutComponent } from './pages/scan/scanout/scanout.component';
import { ScaninComponent } from './pages/scan/scanin/scanin.component';
import { ScanitemComponent } from './pages/scan/scanitem/scanitem.component';
import { CheckoutComponent } from './pages/scan/checkout/checkout.component';
import { Http } from './services/http.interceptor';
import { AssetlistComponent } from './report/assetlist/assetlist.component';
import { WorkorderlistComponent } from './report/workorderlist/workorderlist.component';
import { LocationcountComponent } from './report/locationcount/locationcount.component';
import { ItemtransactionComponent } from './report/itemtransaction/itemtransaction.component';
import { UnavailableitemComponent } from './report/unavailableitem/unavailableitem.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { AccessgroupComponent } from './pages/access/accessgroup/accessgroup.component';
import { NewaccessgroupComponent } from './pages/access/newaccessgroup/newaccessgroup.component';
import { UsergroupComponent } from './pages/access/usergroup/usergroup.component';
import { UsergrouplistComponent } from './pages/access/usergrouplist/usergrouplist.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateitemComponent,
    AssigntagComponent,
    ViewitemComponent,
    ViewworkorderComponent,
    RegisteremployeeComponent,
    EditempployeeComponent,
    SearchemployeeComponent,
    RegisteruserComponent,
    EdituserComponent,
    ViewuserComponent,
    ItemmainComponent,
    MenuComponent,
    CreateworkorderComponent,
    EdititemComponent,
    NewtypeComponent,
    EdittypeComponent,
    ViewtypeComponent,
    CreatecategoryComponent,
    EditcategoryComponent,
    ViewcategoryComponent,
    NewreaderComponent,
    EditreaderComponent,
    ViewreaderComponent,
    NewstationComponent,
    EditstationComponent,
    ViewstationComponent,
    CheckinsComponent,
    CheckoutsComponent,
    ApploginComponent,
    DashboardComponent,
    CheckinComponent,
    AssigntoworkorderComponent,
    NewlocationComponent,
    EditlocationComponent,
    ViewlocationComponent,
    WorkorderinquiryComponent,
    TransactionreportComponent,
    IteminquiryComponent,
    ScanoutComponent,
    ScaninComponent,
    ScanitemComponent,
    CheckoutComponent,
    AssetlistComponent,
    WorkorderlistComponent,
    LocationcountComponent,
    ItemtransactionComponent,
    UnavailableitemComponent,
    AccessgroupComponent,
    NewaccessgroupComponent,
    UsergroupComponent,
    UsergrouplistComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    HttpClientModule,
    ToastModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    DialogModule,
    AutoCompleteModule,
    NgxLoadingModule.forRoot({}),
    ConfirmDialogModule,
    ImageModule,
    MultiSelectModule,
    NgIdleKeepaliveModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    MessageService,
    ConfirmationService,
    { provide: HTTP_INTERCEPTORS, useClass: Http, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
