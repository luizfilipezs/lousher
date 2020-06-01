import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { EnderecoService } from '../services/endereco.service';
import { CartItem } from '../cart.item';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.styl']
})
export class PurchaseComponent implements AfterViewInit {

  cartItems: CartItem[] = [];
  currentItem: CartItem;

  itemIterator: IterableIterator<CartItem>;

  @ViewChildren('innerViews') innerViews: QueryList<ElementRef>;
  currentViewIndex = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private enderecoService: EnderecoService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngAfterViewInit() {
    this.setServicesAuth();
    this.getCartItems();
    this.updateView();
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
    this.cartService.changes$.subscribe((items) => {
      // Set items array
      this.cartItems = items;
      // Set and start iterator
      this.itemIterator = this.nextItem();
      this.itemIterator.next();
    });
    // Get items from server
    this.cartService.getItems();
  }

  // Iterate items for showing each one at the screen
  
  private *nextItem() {
    while (true) for (let item of this.cartItems) yield this.currentItem = item;
  }

  // control inner views

  private updateView() {
    const views = this.innerViews.toArray();

    for (const v of views) {
      v.nativeElement.style.display =
        views.indexOf(v) == this.currentViewIndex ? 'block' : 'none';
    }
  }

  nextView() {
    const total = this.innerViews.toArray().length;

    if (this.currentViewIndex < total - 1) {
      this.currentViewIndex++;
      this.updateView();
    }
  }

  previousView() {
    if (this.currentViewIndex > 0) {
      this.currentViewIndex--;
      this.updateView();
    }
  }

  // validate address form

  validateAndGoNext() {
    // code

    this.nextView();
  }

  // Logout and get out current page

  logout() {
    this.authService.logout();
    this.cartService.clearLocal();
    this.router.navigate(['home']);
  }

}
