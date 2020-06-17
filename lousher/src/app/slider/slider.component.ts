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
import { finalize } from 'rxjs/operators';

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
    // Get offers
    this.productService.getOffers()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe((offers) => {
        this.offers = offers;

        // Adjust slider
        this.sortBy('price-');
        this.adjustButtons(true);
      });

    // Sort by
    this.sortItemsWhenClickingBtn(this.sortByBtn.nativeElement);

    // Changes
    this.vencimentos.changes.subscribe((r) => {
      const validades = this.vencimentos.toArray();
      // Display time
      validades.forEach(element => {
        const native = element.nativeElement;
        this.setTimeRemaining(native, native.textContent);
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
    const dimensions = this.getSliderDimentions();
    const scrollLeft = dimensions.scrollPosition;
    const scrollLeftMax = dimensions.scrollWidth;
    
    const previousBtn = document.querySelector('.left-box');
    const nextBtn = document.querySelector('.right-box');

    const hiddenClass = 'invisible';

    const hideBtn = (btn: Element) => {
      if (!btn.classList.contains(hiddenClass))
        btn.classList.add(hiddenClass);
    }

    const showBtn = (btn: Element) => {
      if (btn.classList.contains(hiddenClass))
        btn.classList.remove(hiddenClass);
    }

    if (firstTime) {
      // initial state
      if (scrollLeftMax === dimensions.width) {
        hideBtn(previousBtn);
      }

      /*
        Next btn will always appear at the initial state
        - even when there is no next content
      */

    } else {
      // came to the end
      if (scrollLeft === 0) {
        hideBtn(nextBtn);
        // if there is previous content
        if (scrollLeftMax > dimensions.width) {
          showBtn(previousBtn);
        }
      }

      // if it is before the end
      if (scrollLeft > 0) {
        showBtn(nextBtn);
      }

      // if it is at the start
      if (dimensions.width + scrollLeft === scrollLeftMax) {
        hideBtn(previousBtn);
      }
    }
  }
  
}