import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreloadStrategyService } from '@utils/services/preload-strategy.service';

export const routes: Routes = [
  // { path: 'catalogo-productos', component: CatalogoProductosComponent }, // Ruta para el catálogo de productos
  // { path: 'productos', component:  ProductosComponent }, 
  // { path: 'swiper-component', component:  SwiperComponentComponent }, 
   {
    path: 'inicio',
    loadChildren: () => import('./modules/welcome/welcome.module')
      .then(m => m.WelcomeModule),
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./modules/users/users.module')
      .then(m => m.UsersModule),
  },
  { path: '', redirectTo: '/inicio/bienvenida', pathMatch: 'full' }, // Ruta predeterminada
];


@NgModule({
    imports: [
      RouterModule.forRoot(routes, {
        preloadingStrategy: PreloadStrategyService

      }),
    ],
    exports: [RouterModule],
  })
  export class AppRoutingModule { }