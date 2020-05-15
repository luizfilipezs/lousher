import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
//import { ImageService } from '../image.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.styl']
})
export class CartComponent implements OnInit {

  isLoggedOut = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService // used in template
    ) { }

  ngOnInit() {
    if (this.authService.user) this.cartService.getItems();
  }

  removeUnity(productId: number, currentQuantity: number) {
    this.cartService.setItem(productId, currentQuantity - 1);
  }

}
