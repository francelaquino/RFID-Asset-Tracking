import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from '../app/pages/menu/menu.component';
import { CreateitemComponent } from '../app/pages/item/createitem/createitem.component';
import { ViewitemComponent } from '../app/pages/item/viewitem/viewitem.component';
import { CreateworkorderComponent } from '../app/pages/workorder/createworkorder/createworkorder.component';
import { ViewworkorderComponent } from '../app/pages/workorder/viewworkorder/viewworkorder.component';
import { EdititemComponent } from './pages/item/edititem/edititem.component';
import { EditempployeeComponent } from './pages/employee/editempployee/editempployee.component';
import { RegisteremployeeComponent } from './pages/employee/registeremployee/registeremployee.component';
import { SearchemployeeComponent } from './pages/employee//searchemployee/searchemployee.component';
import { CreatecategoryComponent } from './pages/category/createcategory/createcategory.component';
import { EditcategoryComponent } from './pages/category/editcategory/editcategory.component';
import { ViewcategoryComponent } from './pages/category/viewcategory/viewcategory.component';
import { EdittypeComponent } from './pages/type/edittype/edittype.component';
import { NewtypeComponent } from './pages/type/newtype/newtype.component';
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
import { ViewuserComponent } from './pages/user/viewuser/viewuser.component';
import { RegisteruserComponent } from './pages/user/registeruser/registeruser.component';
import { EdituserComponent } from './pages/user/edituser/edituser.component';
import { AssetlistComponent } from './report/assetlist/assetlist.component';
import { WorkorderlistComponent } from './report/workorderlist/workorderlist.component';
import { LocationcountComponent } from './report/locationcount/locationcount.component';
import { ItemtransactionComponent } from './report/itemtransaction/itemtransaction.component';
import { UnavailableitemComponent } from './report/unavailableitem/unavailableitem.component';
import { AccessgroupComponent } from './pages/access/accessgroup/accessgroup.component';
import { NewaccessgroupComponent } from './pages/access/newaccessgroup/newaccessgroup.component';
import { UsergroupComponent } from './pages/access/usergroup/usergroup.component';
import { UsergrouplistComponent } from './pages/access/usergrouplist/usergrouplist.component';
import { ChildGuard } from './guards/child.guard';

const routes: Routes = [
  {
    path: 'item',
    component: MenuComponent,
    children: [
      {
        path: 'createitem',
        canActivate: [ChildGuard],
        component: CreateitemComponent,
      },
      {
        path: 'edititem/:id',
        canActivate: [ChildGuard],
        component: EdititemComponent,
      },
      { path: 'searchitem', component: ViewitemComponent },
      { path: 'iteminquiry', component: IteminquiryComponent },
    ],
  },

  {
    path: 'workorder',
    component: MenuComponent,
    children: [
      { path: 'createworkorder', component: CreateworkorderComponent },
      { path: 'searchworkorder', component: ViewworkorderComponent },
      { path: 'workorderinquiry', component: WorkorderinquiryComponent },
      { path: 'assignitemtoworkorder', component: AssigntoworkorderComponent },
    ],
  },
  {
    path: 'employee',
    component: MenuComponent,
    children: [
      { path: 'newemployee', component: RegisteremployeeComponent },
      { path: 'editemployee/:id', component: EditempployeeComponent },
      { path: 'searchemployee', component: SearchemployeeComponent },
    ],
  },
  {
    path: 'report',
    component: MenuComponent,
    children: [
      { path: 'transactionreport', component: TransactionreportComponent },
      { path: 'checkins', component: CheckinsComponent },
      { path: 'checkouts', component: CheckoutsComponent },
      { path: 'assetlist', component: AssetlistComponent },
      { path: 'workorderlist', component: WorkorderlistComponent },
      { path: 'locationcount', component: LocationcountComponent },
      { path: 'itemtransaction', component: ItemtransactionComponent },
      { path: 'unavailableasset', component: UnavailableitemComponent },
    ],
  },
  {
    path: 'transaction',
    component: MenuComponent,
    children: [{ path: 'transactioncheckin', component: CheckinComponent }],
  },
  {
    path: 'scan',
    component: MenuComponent,
    children: [
      { path: 'scanout', component: ScanoutComponent },
      { path: 'scanin', component: ScaninComponent },
      { path: 'itemscanin', component: CheckinComponent },
      { path: 'itemscanout', component: CheckoutComponent },
      { path: 'scanitem', component: ScanitemComponent },
    ],
  },
  {
    path: 'user',
    component: MenuComponent,
    children: [
      { path: 'searchuser', component: ViewuserComponent },
      { path: 'newuser', component: RegisteruserComponent },
      { path: 'edituser/:id', component: EdituserComponent },
    ],
  },
  {
    path: 'settings',
    component: MenuComponent,
    children: [
      { path: 'newtype', component: NewtypeComponent },
      { path: 'edittype/:id', component: EdittypeComponent },
      { path: 'viewtype', component: ViewtypeComponent },
      { path: 'newcategory', component: CreatecategoryComponent },
      { path: 'editcategory/:id', component: EditcategoryComponent },
      { path: 'viewcategory', component: ViewcategoryComponent },
      { path: 'newreader', component: NewreaderComponent },
      { path: 'editreader/:id', component: EditreaderComponent },
      { path: 'viewreader', component: ViewreaderComponent },
      { path: 'newstation', component: NewstationComponent },
      { path: 'editstation/:id', component: EditstationComponent },
      { path: 'viewstation', component: ViewstationComponent },
      { path: 'newlocation', component: NewlocationComponent },
      { path: 'editlocation/:id', component: EditlocationComponent },
      { path: 'viewlocation', component: ViewlocationComponent },
      { path: 'accessgroup', component: AccessgroupComponent },
      { path: 'newaccessgroup', component: NewaccessgroupComponent },
      { path: 'usergroup', component: UsergroupComponent },
      { path: 'usergrouplist', component: UsergrouplistComponent },
    ],
  },
  {
    path: 'login',
    component: ApploginComponent,
  },
  {
    path: 'home',
    component: MenuComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [ChildGuard],
        component: DashboardComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
