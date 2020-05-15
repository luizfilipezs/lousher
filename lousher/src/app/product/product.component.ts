import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CartService } from '../cart.service';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { finalize } from 'rxjs/operators';

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
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    this.getProduct();

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

  changeQuantityButtons() {
    this.upBtn.nativeElement.addEventListener('click', () => {
      if (!(this.quantityInCart + 1 > this.product.qntd_disponivel))
        this.quantityInCart++;
    });
    
    this.downBtn.nativeElement.addEventListener('click', () => {
      if (!(this.quantityInCart - 1 < 0))
        this.quantityInCart--;
    })
  }

  getProduct() {
    const id = +this.route.snapshot.paramMap.get('id');
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
    this.cartService.checkItem(this.product.id)
      .pipe(
        finalize(() => this.changeQuantityButtons())
      )
      .subscribe(
        (item) => this.quantityInCart = item.qntd,
        (error) => this.quantityInCart = 0
      );
  }

  setCart() {
    this.cartService.setItem(this.product.id, this.quantityInCart);
  }

}