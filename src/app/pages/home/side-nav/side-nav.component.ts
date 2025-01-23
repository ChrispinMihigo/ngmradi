import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IS_MEDIUM } from '../../../app.constants';
import { WindowsObserverService } from '../../../core/services/utilities/windows-observer.service';
import { StateService } from '../../../core/services/utilities/state.service';

@Component({
  selector: 'app-side-nav',
  imports: [
    MatSidenavModule,
    MatMenuModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
  ],
  template: `
    <mat-drawer-container>
      <mat-drawer
        [mode]="viewPoint() >= isMedium ? 'side' : 'over'"
        [opened]="viewPoint() >= isMedium || isToggleDrawer()"
      >
        <a
          routerLink="/projects"
          mat-menu-item
          routerLinkActive="active-link"
          (click)="toggleDrawer()"
        >
          <mat-icon>dataset</mat-icon>
          Projects
        </a>
        <a
          (click)="toggleDrawer()"
          routerLink="/contributors"
          mat-menu-item
          routerLinkActive="active-link"
        >
          <mat-icon>group</mat-icon>
          Contributeurs
        </a>
      </mat-drawer>

      <mat-drawer-content>
        <router-outlet />
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: `
  mat-drawer-container {
    height: calc(100vh - 65px);
    display: flex;
    flex-direction: column;
  }

  mat-drawer {
    width: 220px;
    border-right: 1px solid var(--mat-sys-outline-variant);
    border-radius: 0%;
  }

  .active-link {
    background: var(--mat-sys-outline-variant);
  }
  `,
})
export class SideNavComponent {
  isMedium = IS_MEDIUM;
  viewPoint = inject(WindowsObserverService).width;
  state = inject(StateService);
  isToggleDrawer = computed(() => this.state.isToggleDrawer());
  toggleDrawer = () => this.state.isToggleDrawer.update((value) => !value);
}
