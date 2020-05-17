import { NgModule } from '@angular/core';
import { Routes, ExtraOptions, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.service';

import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ListComponent } from './list/list.component';
import { PurchaseComponent } from './purchase/purchase.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'list/:listName', component: ListComponent },
  { path: 'purchase', component: PurchaseComponent, canActivate: [AuthGuard] },
  { path: 'notFound', component: NotFoundComponent },
  { path: '**', redirectTo: '' }
];

const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
  onSameUrlNavigation: 'reload',
  scrollPositionRestoration: 'enabled'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
