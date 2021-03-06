import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

let header: HTMLElement;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.styl']
})
export class HeaderComponent implements OnInit {

  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private router: Router
    ) { }

  ngOnInit() {
    header = document.querySelector('.main-header');
  }

  typingQuery(event: KeyboardEvent) {
    if (event.keyCode === 13) this.search();
  }

  search() {
    let q = this.searchInput.nativeElement.value;

    if (q) {
      this.searchInput.nativeElement.select();

      q = q.trim(); // Remove first and last white spaces
      q = q.toLowerCase(); // Lower case
      q = q.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove accents
      q = q.replace(/ /g, '_'); // Replace white spaces by underline (_)
      
      this.router.navigate(['list', `search:${q}`]);
    }
  }

  toggleCart() {
    if (this.authService.toggleVal)
      this.authService.toggleView();

    this.cartService.toggleView();
  }

  toggleAccount() {
    if (this.cartService.toggleVal)
      this.cartService.toggleView();

    this.authService.toggleView();
  }

  @HostListener('window:scroll')
  toggleShadow() {
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
