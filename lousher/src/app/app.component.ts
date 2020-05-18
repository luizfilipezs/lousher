import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fadeInAnimation } from './animations/fade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl'],
  animations: [
    fadeInAnimation
  ]
})
export class AppComponent {
  title = 'lousher';

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
