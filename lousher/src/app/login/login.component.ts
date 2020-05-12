import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { OrderService, OrderInfo } from '../order.service';
import { forkJoin } from 'rxjs';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements AfterViewInit {

  errorWhenLoggingIn = false;
  errorWhenRegistering = false;
  errorGettingOrders = false;

  orders: OrderInfo[] = [];

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private cartService: CartService
    ) { }

  ngAfterViewInit() {
    if (this.authService.user) this.getOrders();
  }

  getOrders() {
    // Set authorization header in order service
    this.orderService.setAuth(this.authService.token);
    // Get orders and their items
    forkJoin(this.orderService.get(), this.orderService.getOrderItems())
      .subscribe(
        ([orders, orderItems]) => this.orders = this.orderService.formatOrders(orders, orderItems),
        (error) => this.errorGettingOrders = true
      );
  }

  login(username: string, password: string) {
    if (username && password) {
      this.authService.login(username, password)
        .subscribe(
          (sucess) => {
            // Clear error message (if there's one)
            this.errorWhenLoggingIn = false;
            // Get orders
            this.getOrders();
            // Get cart
            this.cartService.getItems();
          },
          (error) => this.errorWhenLoggingIn = true
        );
    } else {
      this.errorWhenLoggingIn = true;
    }
  }

  signup(username: string, email: string, password1: string, password2: string) {
    if (username && email && password1 && password2) {
      this.authService.signup(username, email, password1, password2)
        .subscribe(
          (sucess) => this.errorWhenRegistering = false,
          (error) => this.errorWhenRegistering = true
        );
    } else {
      this.errorWhenRegistering = true;
    }
  }

  logout() {
    this.authService.logout();
    this.cartService.clearLocal();
  };

}
