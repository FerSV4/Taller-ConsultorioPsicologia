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
});