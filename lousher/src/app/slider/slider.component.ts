import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.styl']
})
export class SliderComponent implements AfterViewInit {

  offers: Product[] = [];

  @ViewChild('slider') slider: ElementRef;

  constructor(private productService: ProductService) { }
  
  ngAfterViewInit() {
    // Adjust slider
    this.slider.nativeElement.scrollLeft = 0;
    this.adjustButtons(true);

    // Get offers
    this.productService.getOffers()
      .subscribe((offers) => this.offers = offers);
  }

  /* ORDER BY */

  orderBy(arg: 'price-' | 'price+') {
    this.offers.sort((a, b) => {
      if (arg == 'price-')
        return (a.preco > b.preco) ? 1 : -1;
      else if (arg == 'price+')
        return (a.preco < b.preco) ? 1 : -1;
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
  
  async setTimeRemaining(element: HTMLElement, limitDate: string) {
    let seconds = (Date.parse(limitDate) - Date.now()) / 1000;

    while (seconds > 0) {
      element.textContent = new Date(seconds * 1000).toISOString().substr(11, 8);
      seconds--;
      await new Promise(r => setTimeout(r, 1000));
    }

    const parent = (element.parentElement || element.parentNode) as HTMLElement;
    parent.remove();
  }
}