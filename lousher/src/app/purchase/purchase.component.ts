import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { EnderecoService } from '../services/endereco.service';
import { CartItem } from '../cart.item';
import { Router } from '@angular/router';

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
    private router: Router
  ) { }

  ngOnInit() {
    this.setServicesAuth();
  }

  // Set authorization header in services

  private setServicesAuth() {
    const token = this.authService.token;

    this.cartService.setAuth(token);
    this.enderecoService.setAuth(token);
    this.orderService.setAuth(token)
  }

  // Get cart

  private getCartItems() {
    // Observe changes
    this.cartService.changes$.subscribe((items) => this.cartItems = items);
    // Get items from server
    this.cartService.getItems();
  }

  // Logout and get out current page

  logout() {
    this.authService.logout();
    this.cartService.clearLocal();
    this.router.navigate(['home']);
  }

}
