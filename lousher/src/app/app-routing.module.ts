import { NgModule } from '@angular/core';
import { Routes, ExtraOptions, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.service';

import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'product', component: ProductComponent },
  //{ path: 'list', component: ListComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
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
