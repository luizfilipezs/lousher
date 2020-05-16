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
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.getItems(params.get('listName'));
    });
  }

  getItems(type: string) {
    // Search
    if (type && type.startsWith('search:')) {
      type = type.substring(7);
      this.title = `Busca: ${type.replace(/_/g, ' ')}`; 
      this.subscribe(this.productService.search(type));
    }
    // Offers
    else if (type === 'offers') {
      this.title = 'Ofertas';
      this.subscribe(this.productService.getOffers());
    }
    // Lists
    else if (type === 'presente') {
      this.title = 'Presentes que você amaria';
      this.subscribe(this.productService.search('leve_composto_carnoso'));
    }
    else if (type === 'amigos') {
      this.title = 'Para degustar com um amigo';
      this.subscribe(this.productService.search('pinot_branco'));
    }
    else if (type === 'reuniao') {
      this.title = 'Ideais para celebrar';
      this.subscribe(this.productService.search('amadeirado_austero_seco'));
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
