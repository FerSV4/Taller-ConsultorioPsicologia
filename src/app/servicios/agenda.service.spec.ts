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
      limit: () => supabaseFalso,
      maybeSingle: async () => mockRespuesta,
      insert: async () => mockRespuesta,
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


});