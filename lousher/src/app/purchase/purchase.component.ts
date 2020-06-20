import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { EnderecoService } from '../services/endereco.service';
import { CartItem } from '../cart.item';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Order, OrderItem } from '../order';
import { Endereco } from '../endereco';
import { Observable, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.styl']
})
export class PurchaseComponent implements AfterViewInit {

  order = new Order();

  endereco: Endereco = {
    uf: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: 0,
    cep: '',
    complemento: '',
    nome_destinatario: '',
    telefone: ''
  }

  sendingAddress = false;
  creatingOrder = false;
  errorCreatingOrder = false;
  errorSendingItems = false;

  cartItems: CartItem[] = [];
  currentItem: CartItem;

  itemIterator: IterableIterator<CartItem>;

  @ViewChildren('innerViews') innerViews: QueryList<ElementRef>;
  currentViewIndex = 0;

  addressForm: FormGroup;

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private enderecoService: EnderecoService,
    private orderService: OrderService,
    private router: Router,
    private formBuilder: FormBuilder
  )
  {
    this.addressForm = this.formBuilder.group(this.endereco);
  }

  ngAfterViewInit() {
    // Set up view
    this.setServicesAuth();
    this.getCartItems();
    this.updateView();

    // Order data
    this.order.usuario = this.authService.user.user_id;

    // Secondary actions
    this.getUserAddress();
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

  // Check if user has a registered address

  private getUserAddress() {
    this.enderecoService.getUserAddress()
      .subscribe(
        (address) => {
          this.endereco = address;

          delete address.id;
          this.addressForm = this.formBuilder.group(address);
        }
      );
  }

  // Validate address form

  validateAndGoNext() {
    if (this.addressForm.valid) {
      this.sendingAddress = true;

      const validAddress = this.addressForm.value;
      let send: Observable<Endereco>;

      if (this.endereco.id)
        // PUT Endereco
        send = this.enderecoService.updateEndereco(this.endereco.id, validAddress);
      else
        // POST Endereco
        send = this.enderecoService.changeUserAddress(validAddress);

      send
        .pipe(
          finalize(() => this.sendingAddress = false)
        )
        .subscribe((address) => {
          this.endereco = address;
          this.order.endereco_id = address.id;
          this.nextView();
        });
    }
  }

  // update order.observacoes when its input in template changes

  setObservacoes(text: string) {
    this.order.observacoes = text;
  }

  // finalize order

  postOrder() {
    this.creatingOrder = true;
    this.errorCreatingOrder = false;

    this.orderService.post(this.order)
      .subscribe(
        (order) => {
          this.order = order;
          this.postOrderItens();
        },
        (error) => {
          this.creatingOrder = false;
          this.errorCreatingOrder = true;
        }
      );
  }

  postOrderItens() {
    this.errorCreatingOrder = false;
    this.errorSendingItems = false;
    
    let orderItems: Observable<OrderItem>[] = [];

    this.cartItems.forEach(cartItem => {
      orderItems.push(
        this.orderService.postOrderItem({
          pedido: this.order.id,
          produto_id: cartItem.produto.id,
          qntd: cartItem.qntd
        })
      )
    });

    forkJoin(orderItems)
      .pipe(
        finalize(() => this.creatingOrder = false)
      )
      .subscribe(
        (success) => this.nextView(),
        (error) => this.errorSendingItems = true
      );
  }

  // Logout and get out current page

  logout() {
    this.authService.logout();
    this.cartService.clearLocal();
    this.router.navigate(['home']);
  }

}
