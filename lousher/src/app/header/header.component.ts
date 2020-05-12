import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';

let header: HTMLElement;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.styl']
})
export class HeaderComponent implements OnInit {

  constructor(
    private cartService: CartService,
    private authService: AuthService) { }

  ngOnInit() {
    header = document.querySelector('.main-header');
  }

  search(input: HTMLInputElement): void {
    const q = input.value.trim();
    if (q) {
      input.select();
    }
  }

  toggleCart(): void {
    this.cartService.toggleView();
  }

  toggleAccount(): void {
    this.authService.toggleView();
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
