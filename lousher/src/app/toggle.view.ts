import { Subject } from 'rxjs';

export class ToggleView {
  private toggleState = new Subject();
  toggleState$ = this.toggleState.asObservable();
  toggleVal = false;

  constructor() { }

  toggleView() {
    this.toggleVal = !this.toggleVal;
    this.toggleState.next(this.toggleVal);
  }
}