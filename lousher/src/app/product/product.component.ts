import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CartService } from '../cart.service';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.styl']
})
export class ProductComponent implements OnInit {

  product: Product;

  @Input('quantityInCart') quantityInCart: number;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    this.getProduct();
  }

  getProduct() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.productService.getById(id)
      .subscribe(
        (product) => {this.product = product;console.log(product)},
        (error) => this.router.navigate(['/notFound'])
      );
  }

  setCart() {
    if (this.product)
      this.cartService.addItem(this.product.id, this.quantityInCart)
        .subscribe();
  }

}