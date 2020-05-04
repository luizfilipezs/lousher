import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CartService } from '../cart.service';
import { Product } from '../product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.styl']
})
export class ProductComponent implements OnInit {

  product: Product;
  @Input('quantityInCart') quantityInCart: number;

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {/*
    const id = +this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(id)
      .subscribe(
        (product) => this.product = product,
        (error) => this.router.navigate(['/notFound'])
      );*/
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addItem(this.product.id, this.quantityInCart)
        .subscribe();
    }
  }

}
