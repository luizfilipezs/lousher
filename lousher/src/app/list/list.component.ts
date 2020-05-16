import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.styl']
})
export class ListComponent implements OnInit {

  products: Product[] = [];
  error = false;
  noResults = false;
  title: string;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.getItems(params.get('listName'));
    });
  }

  getItems(type: string) {
    // Search
    if (type && type.startsWith('search:')) {
      this.title = 'Busca: ' + type.substring(7).replace(/%20/g, ' ');
      this.subscribe(this.productService.search(type));
    }
    // Offers
    else if (type === 'offers') {
      this.title = 'Ofertas';
      this.subscribe(this.productService.getOffers());
    }
    // Wine type
    else {
      this.title = type.replace('_', ' ');
      this.subscribe(this.productService.getByType(type));
    }
  }

  private subscribe(obs: Observable<Product[]>) {
    obs
      .subscribe(
        (items) => {
          this.products = items;
          this.noResults = items.length === 0;
        },
        (error) => this.error = true
      );
  }

}
