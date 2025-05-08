import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { TableComponent } from "./components/table/table.component";
import { InvoiceComponent } from "./components/invoice/invoice.component";
import { EntityComponent } from "./components/infoEntities/entity.component";
import { ReportDisabilityComponent } from './components/ReportDisability/ReportDisability.component';
import { consultStateDisabilityComponent } from './components/consultStateDisability/consult-state-disability.component';
import { InfoUserComponent } from './components/infoUsers/info-users.component';
const routes: Routes = [
  { path: 'login', component:  LoginComponent}, 
  { path: 'registro', component: RegisterComponent},
  { path: 'lista-reportes-incapacidad', component: TableComponent},
  { path: 'facturas', component: InvoiceComponent},
  { path: 'contacto-entidades', component: EntityComponent},
  { path: 'registrar-incapacidad', component: ReportDisabilityComponent},
  { path: 'consultar-estado-incapacidad', component: consultStateDisabilityComponent},
  { path: 'mi-cuenta', component:  InfoUserComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
