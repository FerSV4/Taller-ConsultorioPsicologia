import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { AgendaService } from '../../servicios/agenda.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [FullCalendarModule, FormsModule, UpperCasePipe],
  template: `
    <section class="contenedor">
      <div class="header">
        <h2>Calendario</h2>
        <button class="btn-nuevo" (click)="irAAgendar()">Agendar Cita</button>
      </div>

      @if (cargando) {
        <p>Cargando calendario...</p>
      } @else {
        <div class="calendario-wrapper">
          <full-calendar #calendario [options]="calendarOptions"></full-calendar>
        </div>
      }

      @if (mostrarModalDetalle) {
        <div class="modal-overlay" (click)="cerrarModalDetalle()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            
            @if (!modoEdicion) {
              <div class="modal-header">
                <h3>Detalle de la Cita</h3>
                <span class="badge-estado" [class]="eventoSeleccionado?.estado">
                  {{ eventoSeleccionado?.estado | uppercase }}
                </span>
              </div>
              <div class="modal-body">
                <p><strong>Paciente:</strong> {{ eventoSeleccionado?.nombre }} {{ eventoSeleccionado?.apellido }}</p>
                <p><strong>Contacto:</strong> CI: {{ eventoSeleccionado?.ci }} | Tel: {{ eventoSeleccionado?.telefono }}</p>
                <p><strong>Fecha:</strong> {{ eventoSeleccionado?.fecha }}</p>
                <p><strong>Horario:</strong> {{ eventoSeleccionado?.hora_inicio.substring(0,5) }} - {{ eventoSeleccionado?.hora_fin.substring(0,5) }}</p>
                <p><strong>Nota:</strong> {{ eventoSeleccionado?.nota || 'Sin notas' }}</p>
                
                <div class="acciones-estado">
                  <div class="botones-estado">
                    <button class="btn-estado btn-asistio" (click)="cambiarEstado('asistio')">Asistió</button>
                    <button class="btn-estado btn-falto" (click)="cambiarEstado('falto')">Faltó</button>
                    <button class="btn-estado btn-cancelado" (click)="cambiarEstado('cancelado')">Cancelar</button>                  </div>
                  @if (errorEstado) {
                    <p class="error-msg mt-10">{{ errorEstado }}</p>
                  }
                </div>
              </div>
              <div class="modal-footer footer-distribuido">
                <div>
                  <button class="btn-icono btn-editar" (click)="activarEdicion()">Editar</button>
                  <button class="btn-icono btn-eliminar" (click)="eliminarCita()">Eliminar</button>
                </div>
                <button class="btn-secundario" (click)="cerrarModalDetalle()">Cerrar</button>
              </div>
            } @else {
              <div class="modal-header">
                <h3>Editar Cita</h3>
              </div>
              <div class="modal-body form-body">
                <div class="fila-form">
                  <input [(ngModel)]="eventoEdicion.nombre" placeholder="Nombre">
                  <input [(ngModel)]="eventoEdicion.apellido" placeholder="Apellido">
                </div>
                <div class="seccion-form">
                  <label>Horario</label>
                  <input [(ngModel)]="eventoEdicion.fecha" type="date">
                  <div class="fila-form">
                    <input [(ngModel)]="eventoEdicion.hora_inicio" type="time">
                    <span>a</span>
                    <input [(ngModel)]="eventoEdicion.hora_fin" type="time">
                  </div>
                </div>
                <textarea [(ngModel)]="eventoEdicion.nota" placeholder="Nota"></textarea>
                
                @if (errorEstado) {
                  <p class="error-msg">{{ errorEstado }}</p>
                }
              </div>
              <div class="modal-footer">
                <button class="btn-primario" (click)="guardarEdicion()" [disabled]="guardando">
                  {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
                </button>
                <button class="btn-secundario" (click)="cancelarEdicion()" [disabled]="guardando">Cancelar</button>
              </div>
            }
          </div>
        </div>
      }

      @if (mostrarModalCreacion) {
        <div class="modal-overlay" (click)="cerrarModalCreacion()">
          <div class="modal-content form-amplio" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Agendar Cita Rápida</h3>
              <button class="btn-cerrar" (click)="cerrarModalCreacion()">×</button>
            </div>
            <div class="modal-body form-body">
              <div class="fila-form">
                <input [(ngModel)]="nuevoNombre" placeholder="Nombre">
                <input [(ngModel)]="nuevoApellido" placeholder="Apellido">
              </div>
              <div class="seccion-form">
                <label>Contacto</label>
                <div class="fila-form">
                  <input [(ngModel)]="nuevoCi" placeholder="Carnet de Identidad">
                  <input [(ngModel)]="nuevoTelefono" placeholder="Telefono">
                </div>
              </div>
              <div class="seccion-form">
                <label>Horario</label>
                <input [(ngModel)]="nuevaFecha" type="date">
                <div class="fila-form">
                  <input [(ngModel)]="nuevaHoraInicio" type="time">
                  <span>a</span>
                  <input [(ngModel)]="nuevaHoraFin" type="time">
                </div>
              </div>
              <textarea [(ngModel)]="nuevaNota" placeholder="Nota o motivo de consulta"></textarea>
              
              @if (errorCreacion) {
                <p class="error-msg">{{ errorCreacion }}</p>
              }
            </div>
            <div class="modal-footer">
              <button class="btn-primario" (click)="guardarCita()" [disabled]="guardando">
                {{ guardando ? 'Guardando...' : 'Agendar' }}
              </button>
              <button class="btn-secundario" (click)="cerrarModalCreacion()">Cancelar</button>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .contenedor { max-width: 1000px; margin: 20px auto; padding: 0 15px; font-family: sans-serif; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .btn-nuevo { background: #0ea5e9; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; }
    .btn-nuevo:hover { background: #0284c7; }
    
    .calendario-wrapper { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-content { background: white; width: 100%; max-width: 400px; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
    .form-amplio { max-width: 500px; }
    .modal-header { padding: 15px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
    .modal-header h3 { margin: 0; font-size: 1.1rem; color: #334155; }
    .btn-cerrar { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; }
    .modal-body { padding: 20px; }
    
    .form-body { display: flex; flex-direction: column; gap: 15px; }
    .fila-form { display: flex; gap: 10px; align-items: center; }
    .fila-form input { flex: 1; }
    .seccion-form { background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0; }
    .seccion-form label { display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 5px; font-weight: bold; text-transform: uppercase; }
    .form-body input, .form-body textarea { padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-family: inherit; }
    .error-msg { color: #ef4444; margin: 0; font-size: 0.9rem; }
    .mt-10 { margin-top: 10px; }

    .modal-footer { padding: 15px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: right; display: flex; justify-content: flex-end; gap: 10px; }
    .footer-distribuido { justify-content: space-between; align-items: center; }
    .btn-secundario { background: #e2e8f0; color: #475569; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .btn-primario { background: #01837a; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .btn-primario:disabled { background: #94a3b8; }

    .btn-icono { background: none; border: none; padding: 8px; margin-right: 5px; cursor: pointer; font-size: 0.9rem; font-weight: bold; border-radius: 4px; }
    .btn-editar { color: #0284c7; }
    .btn-editar:hover { background: #e0f2fe; }
    .btn-eliminar { color: #dc2626; }
    .btn-eliminar:hover { background: #fee2e2; }

    .badge-estado { padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; }
    .badge-estado.pendiente { background: #e0f2fe; color: #0284c7; }
    .badge-estado.asistio { background: #dcfce7; color: #166534; }
    .badge-estado.falto { background: #fee2e2; color: #991b1b; }
    .badge-estado.cancelado { background: #f1f5f9; color: #475569; }

    .acciones-estado { margin-top: 20px; padding-top: 15px; border-top: 1px dashed #e2e8f0; }
    .titulo-acciones { font-size: 0.85rem; color: #64748b; margin-bottom: 10px; text-transform: uppercase; font-weight: bold; }
    .botones-estado { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .btn-estado { padding: 8px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; transition: opacity 0.2s; }
    .btn-estado:hover { opacity: 0.8; }
    .btn-asistio { background: #22c55e; color: white; }
    .btn-falto { background: #ef4444; color: white; }
    .btn-cancelado { background: #94a3b8; color: white; }
    .btn-pendiente { background: #0ea5e9; color: white; }
  `]
})
export class CalendarioComponent implements OnInit {
  @ViewChild('calendario') calendarComponent!: FullCalendarComponent;
  
  cargando = true;
  guardando = false;
  errorEstado = '';
  
  mostrarModalDetalle = false;
  eventoSeleccionado: any = null;
  modoEdicion = false;
  eventoEdicion: any = {};

  mostrarModalCreacion = false;
  nuevoNombre = '';
  nuevoApellido = '';
  nuevoCi = '';
  nuevoTelefono = '';
  nuevaFecha = '';
  nuevaHoraInicio = '';
  nuevaHoraFin = '';
  nuevaNota = '';
  errorCreacion = '';

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    allDaySlot: false as any,
    events: [],
    locale: esLocale,
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día'
    },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    eventClick: this.manejarClickEvento.bind(this),
    dateClick: this.manejarClickFecha.bind(this)
  };

  constructor(private agendaService: AgendaService, private router: Router) {}

  ngOnInit() {
    this.cargarEventos();
  }

  async cargarEventos() {
    this.cargando = true;
    try {
      const citas = await this.agendaService.obtenerCitas();
      this.calendarOptions.events = citas.map(cita => {
        let color = '#0ea5e9'; 
        if (cita.estado === 'asistio') color = '#22c55e';
        if (cita.estado === 'falto') color = '#ef4444';
        if (cita.estado === 'cancelado') color = '#94a3b8';

        return {
          id: cita.id?.toString(),
          title: `${cita.nombre} ${cita.apellido}`,
          start: `${cita.fecha}T${cita.hora_inicio}`,
          end: `${cita.fecha}T${cita.hora_fin}`,
          backgroundColor: color,
          borderColor: color,
          extendedProps: { ...cita, id: cita.id }
        };
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.cargando = false;
    }
  }

  manejarClickEvento(arg: EventClickArg) {
    this.eventoSeleccionado = { ...arg.event.extendedProps, id: arg.event.id };
    this.errorEstado = '';
    this.modoEdicion = false;
    this.mostrarModalDetalle = true;
  }

  cerrarModalDetalle() {
    this.mostrarModalDetalle = false;
    this.eventoSeleccionado = null;
    this.modoEdicion = false;
  }

  async cambiarEstado(nuevoEstado: string) {
    if (!this.eventoSeleccionado || !this.eventoSeleccionado.id) return;
    this.errorEstado = '';
    try {
      const error = await this.agendaService.actualizarEstadoCita(Number(this.eventoSeleccionado.id), nuevoEstado);
      if (error) {
        this.errorEstado = error;
      } else {
        this.cerrarModalDetalle();
        this.cargarEventos();
      }
    } catch (err) {
      this.errorEstado = 'Error interno';
    }
  }

  activarEdicion() {
    this.eventoEdicion = { ...this.eventoSeleccionado };
    this.eventoEdicion.hora_inicio = this.eventoEdicion.hora_inicio.substring(0, 5);
    this.eventoEdicion.hora_fin = this.eventoEdicion.hora_fin.substring(0, 5);
    this.modoEdicion = true;
    this.errorEstado = '';
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.errorEstado = '';
  }

  async guardarEdicion() {
    this.errorEstado = '';
    if (!this.eventoEdicion.fecha || !this.eventoEdicion.hora_inicio || !this.eventoEdicion.hora_fin) {
      this.errorEstado = 'Fecha y horarios son obligatorios';
      return;
    }

    if (this.eventoEdicion.hora_inicio >= this.eventoEdicion.hora_fin) {
      this.errorEstado = 'La hora de finalización debe ser posterior a la de inicio';
      return;
    }

    this.guardando = true;
    try {
      const citaActualizada = {
        nombre: this.eventoEdicion.nombre,
        apellido: this.eventoEdicion.apellido,
        fecha: this.eventoEdicion.fecha,
        hora_inicio: this.eventoEdicion.hora_inicio + ':00',
        hora_fin: this.eventoEdicion.hora_fin + ':00',
        nota: this.eventoEdicion.nota
      };

      const error = await this.agendaService.actualizarCita(Number(this.eventoEdicion.id), citaActualizada);
      if (error) {
        this.errorEstado = error;
      } else {
        this.cerrarModalDetalle();
        this.cargarEventos();
      }
    } catch (err) {
      this.errorEstado = 'Error';
    } finally {
      this.guardando = false;
    }
  }

  async eliminarCita() {
    if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) return;
    
    this.errorEstado = '';
    try {
      const error = await this.agendaService.eliminarCita(Number(this.eventoSeleccionado.id));
      if (error) {
        this.errorEstado = error;
      } else {
        this.cerrarModalDetalle();
        this.cargarEventos();
      }
    } catch (err) {
      this.errorEstado = 'Error al eliminar';
    }
  }

  manejarClickFecha(arg: DateClickArg) {
    if (arg.view.type === 'dayGridMonth') {
      this.calendarComponent.getApi().changeView('timeGridDay', arg.dateStr);
      return;
    }
    const fechaStr = arg.dateStr;
    this.nuevaFecha = fechaStr.split('T')[0];
    if (fechaStr.includes('T')) {
      const timePart = fechaStr.split('T')[1];
      this.nuevaHoraInicio = timePart.substring(0, 5);
      const dateObj = new Date(fechaStr);
      dateObj.setHours(dateObj.getHours() + 1);
      this.nuevaHoraFin = dateObj.toTimeString().substring(0, 5);
    } else {
      this.nuevaHoraInicio = '08:00';
      this.nuevaHoraFin = '09:00';
    }
    this.nuevoNombre = '';
    this.nuevoApellido = '';
    this.nuevoCi = '';
    this.nuevoTelefono = '';
    this.nuevaNota = '';
    this.errorCreacion = '';
    this.mostrarModalCreacion = true;
  }

  async guardarCita() {
    this.errorCreacion = '';
    if (!this.nuevoNombre.trim() || !this.nuevaFecha || !this.nuevaHoraInicio || !this.nuevaHoraFin) {
      this.errorCreacion = 'El nombre, fecha y horarios son obligatorios';
      return;
    }

    if (this.nuevaHoraInicio >= this.nuevaHoraFin) {
      this.errorCreacion = 'La hora de finalización debe ser posterior a la de inicio';
      return;
    }

    this.guardando = true;
    try {
      const error = await this.agendaService.registrarCita({
        nombre: this.nuevoNombre,
        apellido: this.nuevoApellido,
        ci: this.nuevoCi,
        telefono: this.nuevoTelefono,
        fecha: this.nuevaFecha,
        hora_inicio: this.nuevaHoraInicio + ':00',
        hora_fin: this.nuevaHoraFin + ':00',
        nota: this.nuevaNota,
        estado: 'pendiente',
        es_bloqueo: false
      });

      if (error) {
        this.errorCreacion = error;
      } else {
        this.cerrarModalCreacion();
        this.cargarEventos();
      }
    } catch (err) {
      this.errorCreacion = 'Error de conexion';
    } finally {
      this.guardando = false;
    }
  }
  cerrarModalCreacion() {
    this.mostrarModalCreacion = false;
  }

  irAAgendar() {
    this.router.navigate(['/agendar']);
  }
}
