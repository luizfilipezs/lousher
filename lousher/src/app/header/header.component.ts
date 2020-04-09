import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../cart.service';

let header;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.styl']
})
export class HeaderComponent implements OnInit {

  constructor(private cartService: CartService) { }

  ngOnInit() {
    header = document.querySelector('.main-header');
  }

  search(input: HTMLInputElement): void {
    const q = input.value.trim();
    if (q) {
      console.log(`Search for ${q}`);
      input.select();
    }
  }

  toggleCart(): void {
    this.cartService.toggleCart();
  }

  @HostListener('window:scroll')
  toggleShadow(): void {
    if (window.scrollY > 58) {
      if (!header.classList.contains('shaded-header'))
        header.classList.add('shaded-header');
    }
    else {
      if (header.classList.contains('shaded-header'))
        header.classList.remove('shaded-header');
    }
  }

}
