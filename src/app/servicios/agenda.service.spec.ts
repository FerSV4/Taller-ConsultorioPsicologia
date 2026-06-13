import { TestBed } from '@angular/core/testing';
import { AgendaService } from './agenda.service';

describe('AgendaService', () => {
  let service: AgendaService;
  let supabaseFalso: any;
  let mockRespuesta: any; 

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgendaService]
    });
    service = TestBed.inject(AgendaService);

    mockRespuesta = { data: null, error: null };

    supabaseFalso = {
      from: () => supabaseFalso,
      select: () => supabaseFalso,
      order: () => supabaseFalso,
      eq: () => supabaseFalso,
      lt: () => supabaseFalso,
      gt: () => supabaseFalso,
      neq: () => supabaseFalso,
      limit: () => supabaseFalso,
      maybeSingle: async () => mockRespuesta,
      insert: async () => mockRespuesta,
      update: () => supabaseFalso,
      then: (resolve: any) => resolve(mockRespuesta) 
    };

    (service as any).supabase = supabaseFalso;
  });

  // 1. Instancia
  it('instancia', () => {
    expect(service).toBeTruthy();
  });

  // 2. Obtener lista
  it('obtenerCitas', async () => {
    mockRespuesta = { data: [{ nombre: 'Juan' }], error: null };
    
    const citas = await service.obtenerCitas();
    
    expect(citas.length).toBe(1);
    expect(citas[0].nombre).toBe('Juan');
  });

  // 3. Pruba de negocio, choque de horario de citas
  it('rechazar choque de horarios', async () => {
    mockRespuesta = { data: { nombre: 'Maria', apellido: 'Gomez' }, error: null };

    const citaPrueba = {
      nombre: 'Carlos', apellido: 'Lopez', ci: '123', telefono: '777',
      fecha: '2026-10-10', hora_inicio: '15:00', hora_fin: '16:00', nota: ''
    };

    const res = await service.registrarCita(citaPrueba);
    
    expect(res).toBe('Horario ocupado por Maria Gomez');
  });

      // 4. Registro correcto
  it('registrar cita libre', async () => {
    mockRespuesta = { data: null, error: null };
    
    const citaPrueba = {
      nombre: 'Ana', apellido: 'Paz', ci: '444', telefono: '111',
      fecha: '2026-10-10', hora_inicio: '10:00', hora_fin: '11:00', nota: ''
    };

    const res = await service.registrarCita(citaPrueba);
    
    expect(res).toBeNull();
  });

  it('rechazar reprogramacion si choca con otra cita', async () => {
    // Arr: Simulo una cita existente a nombre de yan pol
    mockRespuesta = { data: { nombre: 'Yan', apellido: 'Pol' }, error: null };

    const citaEditada = {
      fecha: '2026-11-15', hora_inicio: '09:00', hora_fin: '10:00'
    };

    // Ac--As: Se hace el intento de actualizacion, ser fallido
    const res = await service.actualizarCita(5, citaEditada);
    
    expect(res).toBe('Horario ocupado por Yan Pol');
  });

  it('impedir cambio de estado cuando la cita ya fue cancelada', async () => {
    // Arrg: Se crea una cita cancelada como simulacion para esta prueba...
    mockRespuesta = { data: { estado: 'Cancelado' }, error: null };

    // Ac--As: Aqui se intenta marcarla como asistida, tiene q dar error...
    const res = await service.actualizarEstadoCita(10, 'Asistió');
    
    expect(res).toBe('No se puede modificar una cita cancelada');
  });

  it('rechazar el registro si la hora esta bloqueada', async () => {
    // Arr: Se simula la situacion de un bloqueo de horario desde el mock...
    mockRespuesta = { data: { es_bloqueo: true }, error: null };

    const citaPrueba = {
      nombre: 'Yan', apellido: 'Poloni', ci: '344', telefono: '3155312',
      fecha: '2026-10-13', hora_inicio: '12:00', hora_fin: '13:00', nota: ''
    };

    // Ac--As: Aqui se intenta registrar la cita, pero debe ser rechazada
    const res = await service.registrarCita(citaPrueba);
    
    expect(res).toBe('Horario bloqueado');
  });
});