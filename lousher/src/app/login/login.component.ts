import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { OrderService, OrderInfo } from '../services/order.service';
import { forkJoin } from 'rxjs';
import { CartService } from '../services/cart.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements AfterViewInit {

  errorWhenLoggingIn = false;
  errorWhenRegistering = false;
  errorGettingOrders = false;

  loadingLogin = false;
  loadingRegister = false;

  orders: OrderInfo[] = [];

  constructor(
    public authService: AuthService,
    private orderService: OrderService,
    private cartService: CartService
    ) { }

  ngAfterViewInit() {
    if (this.authService.user) this.getOrders();
  }

  getOrders() {
    // Remove previous error messages after trying to connect to server
    this.errorGettingOrders = false;
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
      this.loadingLogin = true;
      this.errorWhenLoggingIn = false;
      this.authService.login(username, password)
        .pipe(
          finalize(() => this.loadingLogin = false)
        )
        .subscribe(
          (sucess) => {
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
    this.loadingRegister = true;

    username && email && password1 && password2 ?
      this.authService.signup(username, email, password1, password2)
        .pipe(
          finalize(() => this.loadingRegister = false)
        )
        .subscribe(
          (sucess) => this.errorWhenRegistering = false,
          (error) => this.errorWhenRegistering = true
        )
    : this.errorWhenRegistering = true;
  }

  logout() {
    this.authService.logout();
    this.cartService.clearLocal();
    this.orders = [];
  };

}
