import { Component, OnInit } from '@angular/core';
import simpleParallax from 'simple-parallax-js';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl']
})
export class HomeComponent implements OnInit {

  private parallaxEffect: simpleParallax;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isLoggedIn) this.authService.refreshToken();
  }

  applyParallaxEffect() {
    const image = document.querySelector('.parallax-image');
    
    this.parallaxEffect = new simpleParallax(image, {
	    delay: .6,
	    transition: 'cubic-bezier(0,0,0,1)'
    });
  }

  removeParallaxEffect() {
    if (this.parallaxEffect) this.parallaxEffect.destroy();
  }
  
}
