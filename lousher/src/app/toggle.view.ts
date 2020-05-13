import { Subject } from 'rxjs';

export class ToggleView {
  private toggleState = new Subject();
  public toggleState$ = this.toggleState.asObservable();
  public toggleVal = false;

  constructor() { }

  toggleView() {
    this.toggleVal = !this.toggleVal;
    this.toggleState.next(this.toggleVal);
  }
}