import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';
import { OrderService } from '../order.service';
import { EnderecoService } from '../endereco.service';
import { CartItem } from '../cart.item';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.styl']
})
export class PurchaseComponent implements OnInit {

  cartItems: CartItem[] = [];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private enderecoService: EnderecoService,
    private orderService: OrderService,
  ) { }

  ngOnInit() {
  }

  private getCartItems() {
    // Set auth token
    this.cartService.setAuth(this.authService.token);
    // Observe changes
    this.cartService.changes$.subscribe((items) => this.cartItems = items);
    // Get items from server
    this.cartService.getItems();
  }

}
