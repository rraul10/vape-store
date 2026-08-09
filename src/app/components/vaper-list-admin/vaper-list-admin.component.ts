import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../supabase.service';

interface ComboAdmin {
  id: number;
  sabores: string[];
  stock: number;
  guardando?: boolean;
}

interface ProductoAdmin {
  id: number;
  nombre: string;
  emoji: string;
  combos: ComboAdmin[];
}

@Component({
  selector: 'app-vaper-list-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin">

      <!-- ═══════ LOGIN ═══════ -->
      <div class="login-wrap" *ngIf="!logueado">
        <div class="login-card">
          <span class="login-emoji">🔒</span>
          <h1>Panel de stock</h1>
          <p class="login-sub">Acceso solo para gestión interna</p>

          <input
            type="email"
            placeholder="Email"
            class="input"
            [(ngModel)]="email"
            (keyup.enter)="login()"
          >
          <input
            type="password"
            placeholder="Contraseña"
            class="input"
            [(ngModel)]="password"
            (keyup.enter)="login()"
          >

          <p class="error" *ngIf="errorLogin">{{ errorLogin }}</p>

          <button class="btn-login" (click)="login()" [disabled]="cargandoLogin">
            {{ cargandoLogin ? 'Entrando...' : 'Entrar' }}
          </button>
        </div>
      </div>

      <!-- ═══════ PANEL ═══════ -->
      <div class="panel" *ngIf="logueado">

        <header class="panel-header">
          <h1>📦 Gestión de stock</h1>
          <button class="btn-logout" (click)="logout()">Salir</button>
        </header>

        <p class="cargando" *ngIf="cargando">Cargando productos...</p>

        <div class="productos" *ngIf="!cargando">
          <div class="producto" *ngFor="let producto of productos">
            <div class="producto-header">
              <span class="producto-emoji">{{ producto.emoji }}</span>
              <h2>{{ producto.nombre }}</h2>
            </div>

            <div class="combo" *ngFor="let combo of producto.combos">
              <div class="combo-info">
                <span class="combo-nombre">{{ combo.sabores.join(' + ') }}</span>
              </div>

              <div class="combo-controls">
                <button
                  class="btn-stock btn-minus"
                  (click)="cambiarStock(combo, -1)"
                  [disabled]="combo.guardando || combo.stock <= 0"
                >−</button>

                <span class="combo-stock" [class.guardando]="combo.guardando">
                  {{ combo.stock }}
                </span>

                <button
                  class="btn-stock btn-plus"
                  (click)="cambiarStock(combo, 1)"
                  [disabled]="combo.guardando"
                >+</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .admin {
      --ink-950: #0a0913;
      --ink-900: #14122a;
      --violet: #8b5cf6;
      --violet-deep: #6d28d9;
      --magenta-deep: #db2777;
      --mint: #2dd4a7;
      --rose: #fb5271;
      min-height: 100vh;
      background: linear-gradient(180deg, var(--ink-950), var(--ink-900));
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      padding: 1.5rem 1rem;
    }

    /* ── Login ── */
    .login-wrap {
      min-height: 90vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .login-card {
      width: 100%;
      max-width: 340px;
      background: rgba(255,255,255,0.05);
      border: 1.5px solid rgba(255,255,255,0.12);
      border-radius: 1.5rem;
      padding: 2rem 1.5rem;
      text-align: center;
    }
    .login-emoji { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
    .login-card h1 { color: white; font-size: 1.3rem; margin-bottom: 0.4rem; }
    .login-sub { color: rgba(255,255,255,0.45); font-size: 0.85rem; margin-bottom: 1.5rem; }

    .input {
      width: 100%;
      padding: 0.9rem 1rem;
      margin-bottom: 0.75rem;
      background: rgba(255,255,255,0.05);
      border: 1.5px solid rgba(255,255,255,0.15);
      border-radius: 0.75rem;
      color: white;
      font-size: 1rem;
    }
    .input:focus { outline: none; border-color: var(--violet); }

    .error {
      color: var(--rose);
      font-size: 0.85rem;
      margin-bottom: 0.75rem;
    }

    .btn-login {
      width: 100%;
      padding: 0.95rem;
      background: linear-gradient(135deg, var(--violet-deep), var(--magenta-deep));
      border: none;
      border-radius: 0.75rem;
      color: white;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
    }
    .btn-login:disabled { opacity: 0.6; }

    /* ── Panel ── */
    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    .panel-header h1 { color: white; font-size: 1.3rem; }
    .btn-logout {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.7);
      padding: 0.5rem 0.9rem;
      border-radius: 0.6rem;
      font-size: 0.85rem;
      cursor: pointer;
    }

    .cargando { color: rgba(255,255,255,0.4); text-align: center; padding: 2rem; }

    .productos {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      max-width: 520px;
      margin: 0 auto;
    }

    .producto {
      background: rgba(255,255,255,0.04);
      border: 1.5px solid rgba(255,255,255,0.1);
      border-radius: 1.25rem;
      padding: 1.1rem;
    }
    .producto-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.9rem;
    }
    .producto-emoji { font-size: 1.4rem; }
    .producto-header h2 { color: white; font-size: 1.05rem; font-weight: 700; }

    .combo {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.75rem 0;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .combo:first-of-type { border-top: none; }

    .combo-info { flex: 1; min-width: 0; }
    .combo-nombre {
      color: rgba(255,255,255,0.85);
      font-size: 0.85rem;
      line-height: 1.3;
    }

    .combo-controls {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex: 0 0 auto;
    }

    .btn-stock {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 50%;
      border: none;
      font-size: 1.4rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      -webkit-tap-highlight-color: transparent;
    }
    .btn-stock:disabled { opacity: 0.3; cursor: not-allowed; }
    .btn-minus { background: rgba(251,82,113,0.15); color: var(--rose); }
    .btn-plus  { background: rgba(45,212,167,0.15); color: var(--mint); }

    .combo-stock {
      min-width: 2rem;
      text-align: center;
      color: white;
      font-size: 1.15rem;
      font-weight: 700;
      transition: opacity 0.15s ease;
    }
    .combo-stock.guardando { opacity: 0.4; }

    @media (min-width: 480px) {
      .admin { padding: 2.5rem 1.5rem; }
    }
  `]
})
export class VaperListAdminComponent implements OnInit {
  logueado = false;
  cargandoLogin = false;
  errorLogin = '';
  email = '';
  password = '';

  cargando = true;
  productos: ProductoAdmin[] = [];

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit(): Promise<void> {
    const session = await this.supabaseService.getSession();
    this.logueado = !!session;

    this.supabaseService.onAuthStateChange((session) => {
      this.logueado = !!session;
      if (this.logueado) this.cargarProductos();
    });

    if (this.logueado) {
      await this.cargarProductos();
    }
  }

  async login(): Promise<void> {
    this.errorLogin = '';
    if (!this.email || !this.password) {
      this.errorLogin = 'Rellena email y contraseña';
      return;
    }
    this.cargandoLogin = true;
    const { error } = await this.supabaseService.signIn(this.email, this.password);
    this.cargandoLogin = false;

    if (error) {
      this.errorLogin = 'Email o contraseña incorrectos';
      return;
    }
    this.logueado = true;
    await this.cargarProductos();
  }

  async logout(): Promise<void> {
    await this.supabaseService.signOut();
    this.logueado = false;
    this.email = '';
    this.password = '';
  }

  async cargarProductos(): Promise<void> {
    this.cargando = true;
    const data = await this.supabaseService.getProductos();

    this.productos = (data ?? []).map((p: any) => ({
      id: p.id,
      nombre: p.nombre,
      emoji: p.emoji,
      combos: (p.combos ?? []).map((c: any) => ({
        id: c.id,
        sabores: c.sabores,
        stock: c.stock
      }))
    }));

    this.cargando = false;
  }

  async cambiarStock(combo: ComboAdmin, delta: number): Promise<void> {
    const nuevoStock = combo.stock + delta;
    if (nuevoStock < 0) return;

    const anterior = combo.stock;
    combo.stock = nuevoStock; // actualización optimista, se ve al instante
    combo.guardando = true;

    const { error } = await this.supabaseService.updateStock(combo.id, nuevoStock);

    combo.guardando = false;

    if (error) {
      combo.stock = anterior; // si falla, revertimos
      alert('No se pudo guardar el cambio. Revisa tu conexión e inténtalo de nuevo.');
    }
  }
}