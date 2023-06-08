import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'warehousetracking';
  idleState = 'NOT_STARTED';
  countdown?: number;
  lastPing?: Date;
  constructor(
    private Router: Router,
    private idle: Idle,
    private keepalive: Keepalive,
    private cd: ChangeDetectorRef
  ) {
    idle.setIdle(20);
    idle.setTimeout(180);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onTimeout.subscribe(() => {
      this.idle.stop();
      this.Logout();
    });
  }

  Logout(): void {
    localStorage.setItem('IsLogin', '0');
    this.Router.navigate(['login']);
  }
}
