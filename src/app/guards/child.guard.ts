import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  ActivatedRoute,
  NavigationEnd,
} from '@angular/router';
import { Observable } from 'rxjs';
import {
  Router,
  NavigationStart,
  Event as NavigationEvent,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChildGuard {
  event: any;
  constructor(
    private router: Router,
    private Location: Location,
    private route: ActivatedRoute
  ) {
    const routeParams = this.route.snapshot.params;
    const routeQueryParams = this.route.snapshot.queryParams;
    const routeData = this.route.snapshot.data;
    this.doAsyncTask().then((a) => console.log(a));
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }

  doAsyncTask() {
    let allowedPages = [
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'home1',
      'dashboard',
    ];

    let isAllowed = false;

    var promise = new Promise((resolve, reject) => {
      this.router.events.subscribe((event: NavigationEvent) => {
        if (event instanceof NavigationEnd) {
          let paths = event.url.split('/');
          paths.forEach((a) => {
            if (!isAllowed) {
              if (a != '') {
                if (allowedPages.includes(a)) {
                  isAllowed = true;
                  resolve(isAllowed);
                }
              }
            }
          });
          resolve(isAllowed);
        }
      });
    });

    return promise;
  }
}
