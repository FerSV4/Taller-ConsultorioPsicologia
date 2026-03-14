import { Component, OnInit } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { AgendaService, Cita } from '../../servicios/agenda.service';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [UpperCasePipe],
  template: `
    <section class="contenedor">
      <h2>Historial de Registro</h2>
      
      @if (cargando) {
        <div class="estado-carga">Cargando datos</div>
      } @else if (citas.length > 0) {
        <div class="tabla-responsive">
          <table class="tabla-datos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Paciente</th>
                <th>CI / Teléfono</th>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Estado</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              @for (cita of citas; track cita.id) {
                <tr>
                  <td>{{ cita.id }}</td>
                  <td><strong>{{ cita.nombre }} {{ cita.apellido }}</strong></td>
                  <td>
                    <span class="dato-secundario">{{ cita.ci || 'N/A' }}</span><br>
                    <span class="dato-secundario">{{ cita.telefono || 'N/A' }}</span>
                  </td>
                  <td>{{ cita.fecha }}</td>
                  <td>{{ cita.hora_inicio }} a {{ cita.hora_fin }}</td>
                  <td>
                    <span class="badge" [class]="cita.estado">
                      {{ cita.estado | uppercase }}
                    </span>
                  </td>
                  <td class="nota-celda">{{ cita.nota || '-' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="estado-vacio">No hay registros en la base de datos.</div>
      }
    </section>
  `,
  styles: [`
    .contenedor { max-width: 1000px; margin: 30px auto; padding: 0 15px; font-family: sans-serif; }
    h2 { color: #334155; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; }
    
    .estado-carga { padding: 20px; background: #f8fafc; color: #475569; text-align: center; border-radius: 6px; }
    .estado-vacio { padding: 30px; background: #fffbeb; color: #b91c1c; text-align: center; border-radius: 6px; border: 1px dashed #fca5a5; }
    
    .tabla-responsive { overflow-x: auto; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .tabla-datos { width: 100%; border-collapse: collapse; text-align: left; }
    .tabla-datos th { background: #f8fafc; padding: 12px 15px; color: #475569; font-weight: bold; border-bottom: 1px solid #e2e8f0; white-space: nowrap; }
    .tabla-datos td { padding: 12px 15px; border-bottom: 1px solid #e2e8f0; color: #334155; vertical-align: top; }
    .tabla-datos tr:last-child td { border-bottom: none; }
    .tabla-datos tr:hover { background: #f8fafc; }
    
    .dato-secundario { font-size: 0.85rem; color: #64748b; }
    .nota-celda { max-width: 200px; overflow: hidden; text-overflow: ellipsis; font-size: 0.9rem; color: #64748b; }
    
    .badge { padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; letter-spacing: 0.5px; }
    .badge.pendiente { background: #fef08a; color: #b45309; }
    .badge.asistio { background: #bbf7d0; color: #166534; }
    .badge.falto { background: #fecaca; color: #991b1b; }
  `]
})
export class DatosComponent implements OnInit {
  citas: Cita[] = [];
  cargando = true;

  constructor(private agendaService: AgendaService) {}

  async ngOnInit() {
    try {
      this.citas = await this.agendaService.obtenerCitas();
    } catch (error) {
      console.error('Error al cargar historial', error);
    } finally {
      this.cargando = false;
    }
  }
}
