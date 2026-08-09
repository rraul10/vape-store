import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get supabase(): SupabaseClient {
    return this.client;
  }

  async getProductos() {
    const { data, error } = await this.client
      .from('productos')
      .select('id, nombre, precio_eur, tipo, color, emoji, imagen, orden, combos(id, sabores, stock)')
      .order('orden', { ascending: true });

    if (error) {
      console.error('Error cargando productos:', error);
      return [];
    }
    return data;
  }

  // ── Autenticación ──
  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  async signOut() {
    await this.client.auth.signOut();
  }

  async getSession(): Promise<Session | null> {
    const { data } = await this.client.auth.getSession();
    return data.session;
  }

  onAuthStateChange(callback: (session: Session | null) => void) {
    return this.client.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  }

  async updateStock(comboId: number, nuevoStock: number) {
  const { data, error } = await this.client
    .from('combos')
    .update({ stock: nuevoStock })
    .eq('id', comboId)
    .select();

  if (!error && (!data || data.length === 0)) {
    return { error: { message: 'No se actualizó ninguna fila (posible bloqueo de permisos)' } };
  }

  return { error };
}
}