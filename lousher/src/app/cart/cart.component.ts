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
    this.cartService.getItems();
  }

  removeUnity = (productId: number) => this.cartService.removeItem(productId, 1);

}
