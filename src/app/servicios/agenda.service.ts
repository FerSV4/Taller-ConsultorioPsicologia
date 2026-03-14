import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface Cita {
  id?: number;
  nombre: string;
  apellido: string;
  ci: string;
  telefono: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  nota: string;
  es_bloqueo?: boolean;
  estado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = 'https://uqnubywtcusrjwtoefxz.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxbnVieXd0Y3Vzcmp3dG9lZnh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTQyMDcsImV4cCI6MjA4ODM5MDIwN30.m58pgiPm12pwQrbpcA1NFZ3M8Z9bMJ1c_uX7tecbSu4';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async obtenerCitas(): Promise<Cita[]> {
    const { data, error } = await this.supabase
      .from('citas')
      .select('*')
      .order('fecha', { ascending: true })
      .order('hora_inicio', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async registrarCita(nuevaCita: Cita): Promise<string | null> {
    const { data: conflicto, error: errorBusqueda } = await this.supabase
      .from('citas')
      .select('nombre, apellido, hora_inicio, hora_fin')
      .eq('fecha', nuevaCita.fecha)
      .lt('hora_inicio', nuevaCita.hora_fin)
      .gt('hora_fin', nuevaCita.hora_inicio)
      .limit(1)
      .maybeSingle();

    if (errorBusqueda) return 'Error en el servidor';
    if (conflicto) return `Horario ocupado por ${conflicto.nombre} ${conflicto.apellido}`;

    const { error } = await this.supabase.from('citas').insert([nuevaCita]);
    if (error) return error.message;
    
    return null;
  }

  async actualizarEstadoCita(id: number, nuevoEstado: string): Promise<string | null> {
    const { error } = await this.supabase
      .from('citas')
      .update({ estado: nuevoEstado })
      .eq('id', id)
      .select();

    if (error) return error.message;
    return null;
  }

  async actualizarCita(id: number, citaEditada: Partial<Cita>): Promise<string | null> {
    const { data: conflicto, error: errorBusqueda } = await this.supabase
      .from('citas')
      .select('nombre, apellido')
      .eq('fecha', citaEditada.fecha)
      .lt('hora_inicio', citaEditada.hora_fin)
      .gt('hora_fin', citaEditada.hora_inicio)
      .neq('id', id)
      .limit(1)
      .maybeSingle();

    if (errorBusqueda) return 'Error';
    if (conflicto) return `Horario ocupado por ${conflicto.nombre} ${conflicto.apellido}`;

    const { error } = await this.supabase
      .from('citas')
      .update(citaEditada)
      .eq('id', id)
      .select();

    if (error) return error.message;
    return null;
  }

  async eliminarCita(id: number): Promise<string | null> {
    const { error } = await this.supabase
      .from('citas')
      .delete()
      .eq('id', id);

    if (error) return error.message;
    return null;
  }
}
