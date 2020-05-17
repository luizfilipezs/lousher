import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
  ViewChildren,
  QueryList
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.styl']
})
export class SliderComponent implements AfterViewInit {

  _offers: Product[] = [];
  loading = true;

  @ViewChild('slider') slider: ElementRef;
  @ViewChild('sortByBtn') sortByBtn: ElementRef;
  @ViewChildren('vencimentos') vencimentos: QueryList<ElementRef>;

  constructor(private productService: ProductService) { }
  
  ngAfterViewInit() {
    // Adjust slider
    this.slider.nativeElement.scrollLeft = 0;
    this.adjustButtons(true);

    // Get offers
    this.productService.getOffers()
      .subscribe((offers) => {
        this.offers = offers;
        this.loading = false;
      });

    // Sort by
    this.sortItemsWhenClickingBtn(this.sortByBtn.nativeElement);

    // Changes

    this.vencimentos.changes.subscribe((r) => {
      const validades = this.vencimentos.toArray();
      // Display time
      validades.forEach(element => {
        const date = element.nativeElement.textContent;
        this.setTimeRemaining(element.nativeElement, date);
      });
    });
  }
  
  async setTimeRemaining(element: HTMLElement, limitDate: string) {
    const now = new Date();
    const date = new Date(limitDate);
    const time = date.getTime() - now.getTime();

    let seconds = time / 1000;

    while (seconds > 0) {
      let timing = '';

      let days = Math.floor((seconds * 1000) / (1000 * 3600 * 24));
      if (days > 0) {
        timing += `${days} dia`;
        if (days > 1) timing += 's';
        timing += ', ';
      }

      timing += new Date(seconds * 1000).toISOString().substr(11, 8);
      element.textContent = timing;

      seconds--;
      await new Promise(r => setTimeout(r, 1000));
    }

    element.textContent = '...'
  }

  get offers() {
    return this._offers;
  }

  set offers(val) {
    this._offers = val;
    this.sortBy('price-');
  }

  /* ORDER BY */

  sortItemsWhenClickingBtn(modifier: HTMLElement) {
    let downward = false;

    modifier.addEventListener('click', () => {
      downward = !downward;
      if (downward) {
        modifier.textContent = 'Maior preço';
        this.sortBy('price+');
      } else {
        modifier.textContent = 'Menor preço';
        this.sortBy('price-');
      }
    });
  }

  private sortBy(arg: 'price-' | 'price+') {
    this.offers.sort((a, b) => {
      if (arg == 'price-')
        return (a.preco_oferta > b.preco_oferta) ? 1 : -1;
      else if (arg == 'price+')
        return (a.preco_oferta < b.preco_oferta) ? 1 : -1;
    });
  };

  /* Elements */

  getSliderDimentions() {
    return {
      width: this.slider.nativeElement.clientWidth,
      scrollWidth: this.slider.nativeElement.scrollWidth,
      scrollPosition: this.slider.nativeElement.scrollLeft
    };
  }

  navigate(isForward: boolean) {
    const { width, scrollWidth, scrollPosition } = this.getSliderDimentions();
    const pos = scrollPosition + width;

    /* MOVER O SLIDE */
    
    // Ir para do início para fim
    if (!isForward && scrollPosition == 0)
      this.slider.nativeElement.scrollLeft = scrollWidth;
    // Ir para frente e para trás por dentro
    else if (pos < scrollWidth)
      this.slider.nativeElement.scrollLeft = isForward ? scrollPosition + width : scrollPosition - width;
    // Voltar um a um
    else if (!isForward && pos == scrollWidth)
      this.slider.nativeElement.scrollLeft = scrollPosition - width;
    // Ir do fim para o início
    else
      this.slider.nativeElement.scrollLeft = 0;

    this.adjustButtons();
  }

  @HostListener('window:resize', ['true'])
  adjustButtons(firstTime?: true) {
    let { scrollLeft, scrollLeftMax } = this.slider.nativeElement;
    
    const previousBtn = document.querySelector('.left-box'),
          nextBtn = document.querySelector('.right-box');

    if (firstTime)
      scrollLeft = scrollLeftMax;

    // toggle previous button

    if (scrollLeft === scrollLeftMax) {
      if (!previousBtn.classList.contains('invisible'))
        previousBtn.classList.add('invisible');
    }  else {
      if (previousBtn.classList.contains('invisible'))
        previousBtn.classList.remove('invisible');
    }

    // togle next button

    if (scrollLeft === 0) {
      if (!nextBtn.classList.contains('invisible'))
        nextBtn.classList.add('invisible');
    } else {
      if (nextBtn.classList.contains('invisible'))
        nextBtn.classList.remove('invisible');
    }
  }

}