import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
import { ProductService } from '../product.service';

let header: HTMLElement;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.styl']
})
export class HeaderComponent implements OnInit {

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    header = document.querySelector('.main-header');
  }

  search(input: HTMLInputElement) {
    let q = input.value;

    if (q) {
      input.select();

      q = q.trim(); // Remove first and last white spaces
      q = q.toLowerCase(); // Lower case
      q = q.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove accents
      q = q.replace(/ /g, '%20'); // Replace white spaces by URL space (%20)
      
      this.router.navigate(['list', `search:${q}`]);
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
