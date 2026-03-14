import { Routes } from '@angular/router';
import { RegistroCitaComponent } from './componentes/registro-cita/registro-cita.component';
import { DatosComponent } from './componentes/datos/datos.component';
import { CalendarioComponent } from './componentes/calendario/calendario.component';

export const routes: Routes = [
  { path: 'agendar', component: RegistroCitaComponent },
  { path: 'datos', component: DatosComponent },
  { path: 'calendario', component: CalendarioComponent },
  { path: '', redirectTo: 'calendario', pathMatch: 'full' }
];
