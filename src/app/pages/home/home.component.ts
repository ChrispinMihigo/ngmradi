import { Component } from '@angular/core';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SideNavComponent } from './side-nav/side-nav.component';

@Component({
  selector: 'app-home',
  imports: [ToolbarComponent, SideNavComponent],
  template: `
    <app-toolbar />
    <app-side-nav />
  `,
  styles: ``,
})
export default class HomeComponent {}
