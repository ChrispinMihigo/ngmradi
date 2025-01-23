import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  isToggleDrawer = signal(false);
  constructor() {}
}
