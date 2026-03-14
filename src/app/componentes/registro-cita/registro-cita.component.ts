import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgendaService } from '../../servicios/agenda.service';

@Component({
  selector: 'app-registro-cita',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="contenedor">
      <div class="header">
        <h2>Agendar Nueva Cita</h2>
        <button class="btn-secundario" (click)="volverAlCalendario()">Volver al Calendario</button>
      </div>

      <div class="tarjeta-formulario">
        <div class="seccion-form">
          <label>Datos del Paciente</label>
          <div class="fila-form">
            <input [(ngModel)]="nombre" placeholder="Nombre (Obligatorio)">
            <input [(ngModel)]="apellido" placeholder="Apellido">
          </div>
          <div class="fila-form mt-10">
            <input [(ngModel)]="ci" placeholder="Carnet de Identidad">
            <input [(ngModel)]="telefono" placeholder="Telefono de contacto">
          </div>
        </div>

        <div class="seccion-form">
          <label>Programacion</label>
          <input [(ngModel)]="fecha" type="date" class="w-full">
          <div class="fila-form mt-10">
            <div>
              <label class="label-pequeno">Hora Inicio</label>
              <input [(ngModel)]="horaInicio" type="time">
            </div>
            <div>
              <label class="label-pequeno">Hora Fin</label>
              <input [(ngModel)]="horaFin" type="time">
            </div>
          </div>
        </div>

        <div class="seccion-form">
          <label>Observaciones</label>
          <textarea [(ngModel)]="nota" placeholder="Notas adicionales o motivo" rows="3" class="w-full"></textarea>
        </div>

        @if (error) {
          <div class="alerta-error">{{ error }}</div>
        }

        <button class="btn-primario w-full" (click)="guardar()" [disabled]="cargando">
          {{ cargando ? 'Guardando...' : 'Confirmar Cita' }}
        </button>
      </div>
    </section>
  `,
  styles: [`
    .contenedor { max-width: 600px; margin: 30px auto; padding: 0 15px; font-family: sans-serif; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    h2 { color: #334155; margin: 0; }
    
    .tarjeta-formulario { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
    .seccion-form { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9; }
    .seccion-form:last-of-type { border-bottom: none; }
    
    .seccion-form > label { display: block; font-size: 0.9rem; color: #64748b; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; }
    .label-pequeno { display: block; font-size: 0.75rem; color: #94a3b8; margin-bottom: 3px; }
    
    .fila-form { display: flex; gap: 15px; }
    .fila-form > * { flex: 1; }
    .mt-10 { margin-top: 10px; }
    .w-full { width: 100%; box-sizing: border-box; }
    
    input, textarea { padding: 10px; border: 1px solid #cbd5e1; border-radius: 4px; font-family: inherit; font-size: 0.95rem; }
    input:focus, textarea:focus { outline: none; border-color: #0ea5e9; box-shadow: 0 0 0 2px rgba(14,165,233,0.2); }
    
    .alerta-error { background: #fef2f2; color: #b91c1c; padding: 10px; border-radius: 4px; border-left: 4px solid #ef4444; margin-bottom: 15px; font-size: 0.9rem; }
    
    .btn-primario { background: #1a8824; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 1rem; transition: background 0.2s; }
    .btn-primario:hover:not(:disabled) { background: #0284c7; }
    .btn-primario:disabled { background: #94a3b8; cursor: not-allowed; }
    
    .btn-secundario { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; }
    .btn-secundario:hover { background: #e2e8f0; }
  `]
})
export class RegistroCitaComponent {
  nombre = '';
  apellido = '';
  ci = '';
  telefono = '';
  fecha = '';
  horaInicio = '';
  horaFin = '';
  nota = '';
  
  error = '';
  cargando = false;

  constructor(
    private agendaService: AgendaService,
    private router: Router
  ) {}

  async guardar() {
    this.error = '';
    
    if (!this.nombre.trim() || !this.fecha || !this.horaInicio || !this.horaFin) {
      this.error = 'El nombre, fecha y horario son obligatorios.';
      return;
    }

    if (this.horaInicio >= this.horaFin) {
      this.error = 'La hora de fin debe ser posterior a la hora de inicio.';
      return;
    }

    this.cargando = true;

    try {
      const resultado = await this.agendaService.registrarCita({
        nombre: this.nombre.trim(),
        apellido: this.apellido.trim(),
        ci: this.ci.trim(),
        telefono: this.telefono.trim(),
        fecha: this.fecha,
        hora_inicio: this.horaInicio + ':00',
        hora_fin: this.horaFin + ':00',
        nota: this.nota.trim(),
        estado: 'pendiente',
        es_bloqueo: false
      });

      if (resultado) {
        this.error = resultado;
      } else {
        alert('Cita registrada.');
        this.router.navigate(['/calendario']);
      }
    } catch (err: any) {
      this.error = 'Error del sevidor.';
    } finally {
      this.cargando = false;
    }
  }

  volverAlCalendario() {
    this.router.navigate(['/calendario']);
  }
}
