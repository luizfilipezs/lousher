import { Component, OnInit } from '@angular/core';
import simpleParallax from 'simple-parallax-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl']
})
export class HomeComponent implements OnInit {

  private parallaxEffect: simpleParallax;

  constructor() { }

  ngOnInit() {
    this.applyParallaxEffect();
  }

  applyParallaxEffect(): void {
    const image = document.querySelector('.parallax-image');
    
    this.parallaxEffect = new simpleParallax(image, {
	    delay: .6,
	    transition: 'cubic-bezier(0,0,0,1)'
    });
  }

  removeParallaxEffect(): void {
    if (this.parallaxEffect) this.parallaxEffect.destroy();
  }
  
}
