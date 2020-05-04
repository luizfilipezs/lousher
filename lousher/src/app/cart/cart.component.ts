import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../cart.service';
//import { ImageService } from '../image.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.styl']
})
export class CartComponent implements OnInit {

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartService.getItems();
  }

  removeUnity = (productId: number) => this.cartService.removeItem(productId, 1);

}
