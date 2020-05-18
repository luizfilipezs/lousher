import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService, AuthInterceptor, AuthGuard } from './services/auth.service';
import { CartService } from './services/cart.service';
import { ImageService } from './services/image.service';
import { EnderecoService } from './services/endereco.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { SliderComponent } from './slider/slider.component';
import { FooterComponent } from './footer/footer.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductService } from './services/product.service';
import { OrderService } from './services/order.service';
import { ListComponent } from './list/list.component';
import { PurchaseComponent } from './purchase/purchase.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ProductComponent,
    SliderComponent,
    FooterComponent,
    CartComponent,
    LoginComponent,
    NotFoundComponent,
    ListComponent,
    PurchaseComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    ProductService,
    CartService,
    OrderService,
    ImageService,
    EnderecoService,
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
