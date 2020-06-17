import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CartService } from '../services/cart.service';
import { Product } from '../product';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.styl']
})
export class ProductComponent implements OnInit {

  product: Product;
  quantityInCart = 0;

  @ViewChild('upBtn') upBtn: ElementRef;
  @ViewChild('downBtn') downBtn: ElementRef;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    // Observe changes on parameters of current route
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id');
      this.getProduct(id);
    });

    // Change quantityInCart when items from cart are removed
    this.cartService.changes$.subscribe(
      (items) => {
        if (this.product) {
          let itemNotFound = true;
          for (const item of items) {
            if (item.produto.id === this.product.id) {
              this.quantityInCart = item.qntd;
              itemNotFound = false;
              break;
            }
          }
          if (itemNotFound) this.quantityInCart = 0;
        }
      }
    );
  }

  addUnity() {
    if (!(this.quantityInCart + 1 > this.product.qntd_disponivel))
      this.quantityInCart++;
  }

  removeUnity() {
    if (!(this.quantityInCart - 1 < 0))
      this.quantityInCart--;
  }

  getProduct(id: number) {
    this.productService.getById(id)
      .subscribe(
        (product) => {
          this.product = product;
          this.setQuantityInCartFromServer();
        },
        (error) => this.router.navigate(['/notFound'])
      );
  }

  setQuantityInCartFromServer() {
    this.quantityInCart = 0;

    if (this.authService.user) {
      this.cartService.checkItem(this.product.id)
        .subscribe((item) => this.quantityInCart = item.qntd);
    }
  }

  setCart() {
    this.cartService.setItem(this.product.id, this.quantityInCart);
  }

}