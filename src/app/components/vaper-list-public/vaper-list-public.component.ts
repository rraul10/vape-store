import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Combo {
  id: number;
  sabores: string[];
  stock: number;
}

export interface Producto {
  id: number;
  nombre: string;
  precioEur: number;
  tipo: string;
  color: string;
  emoji: string;
  imagen?: string;
  combos: Combo[];
}

@Component({
  selector: 'app-vaper-list-public',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="catalog">

      <!-- Burbujas de fondo -->
      <div class="bubble b1"></div>
      <div class="bubble b2"></div>
      <div class="bubble b3"></div>

      <div class="content">

        <!-- Header -->
        <header class="header">
          <p class="eyebrow">Catálogo en vivo</p>
          <div class="logo-wrap">
            <div class="logo">💨</div>
          </div>
          <h1>Stock Vapers</h1>
        </header>

        <!-- Buscador -->
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            class="search-input"
            placeholder="Buscar producto o sabor..."
            [(ngModel)]="busqueda"
          >
          <button class="search-clear" *ngIf="busqueda" (click)="busqueda = ''">✕</button>
        </div>

        <!-- Filtro por chips -->
        <div class="chips-scroll">
          <button
            *ngFor="let f of filtros"
            class="chip"
            [class.chip-active]="filtroActivo === f.value"
            (click)="filtroActivo = f.value"
          >
            <span class="chip-icon">{{ f.icon }}</span>{{ f.label }}
          </button>
        </div>

        <!-- Contador -->
        <p class="count">{{ productosFiltrados.length }} producto{{ productosFiltrados.length !== 1 ? 's' : '' }}</p>

        <!-- Cards -->
        <div class="grid">
          <div class="card" *ngFor="let producto of productosFiltrados">

            <!-- Imagen -->
            <div class="card-img" [style.background]="producto.color">
              <img *ngIf="producto.imagen"
                   [src]="producto.imagen"
                   [alt]="producto.nombre"
                   loading="lazy"
                   class="photo">
              <span *ngIf="!producto.imagen" class="emoji-big">{{ producto.emoji }}</span>

              <!-- Stock total badge -->
              <div class="stock-badge"
                   [class.stock-ok]="stockTotal(producto) > 5"
                   [class.stock-warn]="stockTotal(producto) > 0 && stockTotal(producto) <= 5"
                   [class.stock-out]="stockTotal(producto) === 0">
                💨
                <span class="stock-num">{{ stockTotal(producto) }}</span>
                <span class="stock-lbl">uds. totales</span>
              </div>
            </div>

            <!-- Cuerpo -->
            <div class="card-body">

              <div class="card-top">
                <h2 class="name">{{ producto.nombre }}</h2>
                <span class="price">{{ producto.precioEur }}€</span>
              </div>

              <hr class="sep">

              <p class="flavors-label">🌈 Combos disponibles</p>
              <ul class="flavors">
                <li *ngFor="let c of producto.combos" [class.sabor-out]="c.stock === 0">
                  <div class="sabor-info">
                    <span class="sabor-nombre">{{ c.sabores.join(' + ') }}</span>
                    <span class="sabor-stock"
                          [class.stock-ok]="c.stock > 2"
                          [class.stock-warn]="c.stock === 2"
                          [class.stock-low]="c.stock === 1"
                          [class.stock-out]="c.stock === 0">
                      {{ c.stock === 0 ? 'Agotado' : (c.stock + (c.stock === 1 ? ' ud.' : ' uds.')) }}
                    </span>
                  </div>
                  <a *ngIf="c.stock > 0"
                     class="wa-btn"
                     [href]="pedirLink(producto, c)"
                     target="_blank"
                     rel="noopener">
                    Pedir →
                  </a>
                </li>
              </ul>

            </div>
          </div>
        </div>

        <!-- Empty -->
        <div class="empty" *ngIf="productosFiltrados.length === 0">
          <span>🔍</span>
          <p>No hay productos que coincidan con tu búsqueda</p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* ── Reset ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Paleta de marca ── */
    .catalog {
      --ink-950: #0a0913;
      --ink-900: #14122a;
      --violet: #8b5cf6;
      --violet-deep: #6d28d9;
      --magenta: #ec4899;
      --magenta-deep: #db2777;
      --amber: #fbbf24;
      --mint: #2dd4a7;
      --rose: #fb5271;
      --font-display: 'Unbounded', -apple-system, sans-serif;
      --font-mono: 'Space Grotesk', -apple-system, sans-serif;
    }

    /* ── Contenedor principal ── */
    .catalog {
      min-height: 100vh;
      background:
        radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139,92,246,0.16), transparent),
        linear-gradient(180deg, var(--ink-950), var(--ink-900));
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      overflow-x: hidden;
      position: relative;
      padding-bottom: 3rem;
    }

    /* ── Burbujas de fondo ── */
    .bubble {
      position: fixed;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.12;
      pointer-events: none;
      animation: float 20s ease-in-out infinite;
    }
    .b1 { width: 300px; height: 300px; background: radial-gradient(circle, #8b5cf6, transparent); top: 10%; left: -8%; animation-delay: 0s; }
    .b2 { width: 250px; height: 250px; background: radial-gradient(circle, #ec4899, transparent); top: 50%; right: -8%; animation-delay: 6s; }
    .b3 { width: 200px; height: 200px; background: radial-gradient(circle, #3b82f6, transparent); bottom: 20%; left: 40%; animation-delay: 12s; }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33%       { transform: translate(20px, -20px) scale(1.08); }
      66%       { transform: translate(-15px, 15px) scale(0.93); }
    }

    /* ── Contenido centrado ── */
    .content {
      position: relative;
      z-index: 1;
      max-width: 520px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    /* ── Header ── */
    .header {
      text-align: center;
      padding: 2.5rem 0 1.5rem;
    }
    .eyebrow {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.22em;
      color: var(--violet);
      margin-bottom: 0.9rem;
    }
    .logo-wrap {
      position: relative;
      display: inline-block;
      margin-bottom: 0.5rem;
    }
    .logo-wrap::before {
      content: '';
      position: absolute;
      inset: -30px;
      background:
        radial-gradient(circle at 30% 70%, rgba(139,92,246,0.35), transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(236,72,153,0.3), transparent 60%);
      filter: blur(18px);
      animation: wisp 6s ease-in-out infinite;
      z-index: -1;
    }
    @keyframes wisp {
      0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.8; }
      50%       { transform: rotate(12deg) scale(1.15); opacity: 1; }
    }
    .logo {
      font-size: 3.5rem;
      display: block;
      filter: drop-shadow(0 0 18px rgba(139, 92, 246, 0.5));
      animation: bounce 3s ease-in-out infinite;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-12px); }
    }
    h1 {
      font-family: var(--font-display);
      font-size: clamp(1.7rem, 6vw, 2.35rem);
      font-weight: 800;
      background: linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #f9a8d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.02em;
    }

    /* ── Buscador ── */
    .search-wrap {
      position: relative;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 1.1rem;
      font-size: 0.95rem;
      opacity: 0.5;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 0.85rem 2.75rem 0.85rem 2.5rem;
      background: rgba(255,255,255,0.04);
      border: 1.5px solid rgba(255,255,255,0.12);
      border-radius: 1rem;
      color: white;
      font-family: var(--font-mono);
      font-size: 0.95rem;
      font-weight: 500;
      transition: border-color 0.2s, background 0.2s;
    }
    .search-input::placeholder { color: rgba(255,255,255,0.35); font-weight: 500; }
    .search-input:hover  { border-color: rgba(139,92,246,0.5); }
    .search-input:focus  { outline: none; border-color: var(--violet); background: rgba(139,92,246,0.06); box-shadow: 0 0 0 3px rgba(139,92,246,0.2); }
    .search-clear {
      position: absolute;
      right: 0.9rem;
      background: rgba(255,255,255,0.1);
      border: none;
      color: rgba(255,255,255,0.6);
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 50%;
      cursor: pointer;
      font-size: 0.75rem;
    }
    .search-clear:hover { background: rgba(255,255,255,0.2); }

    /* ── Filtro chips ── */
    .chips-scroll {
      display: flex;
      gap: 0.6rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      margin-bottom: 0.5rem;
      scrollbar-width: none;
    }
    .chips-scroll::-webkit-scrollbar { display: none; }
    .chip {
      flex: 0 0 auto;
      padding: 0.55rem 1.1rem;
      background: rgba(255,255,255,0.05);
      border: 1.5px solid rgba(255,255,255,0.12);
      border-radius: 50px;
      color: rgba(255,255,255,0.6);
      font-family: var(--font-mono);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .chip-icon { margin-right: 0.4rem; }
    .chip:hover { border-color: rgba(139,92,246,0.5); color: white; background: rgba(139,92,246,0.1); }
    .chip-active {
      background: linear-gradient(135deg, var(--violet-deep), var(--magenta-deep));
      border-color: transparent;
      color: white;
      font-weight: 700;
      box-shadow: 0 4px 18px rgba(139,92,246,0.45);
    }

    /* ── Contador ── */
    .count {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      font-weight: 500;
      color: rgba(255,255,255,0.3);
      margin-bottom: 1.5rem;
      padding-left: 0.25rem;
    }

    /* ── Grid de cards ── */
    .grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* ── Card ── */
    .card {
      background: rgba(255,255,255,0.05);
      border: 1.5px solid rgba(255,255,255,0.1);
      border-radius: 1.75rem;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
      transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    }
    .card:hover {
      border-color: rgba(139,92,246,0.4);
      box-shadow: 0 14px 46px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.08);
    }
    .card:active { transform: scale(0.98); }

    /* Imagen */
    .card-img {
      position: relative;
      height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .card-img::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.35) 100%);
      pointer-events: none;
    }
    .photo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 2rem;
      filter: drop-shadow(0 8px 20px rgba(0,0,0,0.4));
      transition: transform 0.3s ease;
    }
    .card:hover .photo { transform: scale(1.04); }
    .emoji-big { font-size: 5.5rem; }

    /* Stock badge (total del producto) */
    .stock-badge {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1rem;
      background: rgba(10,9,19,0.82);
      backdrop-filter: blur(16px);
      border-radius: 1rem;
      border: 1.5px solid rgba(255,255,255,0.12);
      font-size: 1.1rem;
    }
    .stock-num {
      font-family: var(--font-mono);
      font-size: 1.3rem;
      font-weight: 700;
      color: white;
    }
    .stock-lbl {
      font-family: var(--font-mono);
      font-size: 0.62rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      color: rgba(255,255,255,0.5);
    }

    /* Colores de stock (badge total) */
    .stock-badge.stock-ok   { border-color: rgba(45,212,167,0.45); }
    .stock-badge.stock-ok   .stock-num { color: var(--mint); }
    .stock-badge.stock-warn { border-color: rgba(251,191,36,0.45); animation: pulse-warn 2s infinite; }
    .stock-badge.stock-warn .stock-num { color: var(--amber); }
    .stock-badge.stock-out  { border-color: rgba(251,82,113,0.5); }
    .stock-badge.stock-out  .stock-num { color: var(--rose); }

    @keyframes pulse-warn {
      0%, 100% { box-shadow: 0 4px 20px rgba(251,191,36,0.2); }
      50%       { box-shadow: 0 4px 20px rgba(251,191,36,0.5); }
    }

    /* Cuerpo de la card */
    .card-body { padding: 1.5rem; }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .name {
      color: white;
      font-size: 1.3rem;
      font-weight: 800;
      letter-spacing: -0.01em;
      flex: 1;
    }
    .price {
      position: relative;
      background: linear-gradient(135deg, var(--violet-deep), var(--magenta-deep));
      color: white;
      padding: 0.6rem 1.2rem;
      border-radius: 0.6rem 1rem 1rem 0.6rem;
      font-family: var(--font-display);
      font-size: 1.15rem;
      font-weight: 700;
      white-space: nowrap;
      box-shadow: 0 4px 14px rgba(139,92,246,0.4);
    }
    .price::before {
      content: '';
      position: absolute;
      left: -4px;
      top: 50%;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--ink-900);
      border: 1.5px solid rgba(255,255,255,0.15);
    }

    .sep {
      border: none;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin-bottom: 1rem;
    }

    .flavors-label {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: rgba(255,255,255,0.45);
      margin-bottom: 0.75rem;
    }

    .flavors {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .flavors li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.65rem 0.9rem;
      border-left: 3px solid transparent;
      border-image: linear-gradient(180deg, var(--violet), var(--magenta)) 1;
      background: rgba(255,255,255,0.025);
      border-radius: 0 0.6rem 0.6rem 0;
      transition: background 0.2s ease;
    }
    .flavors li:hover { background: rgba(255,255,255,0.05); }
    .flavors li.sabor-out {
      border-image: linear-gradient(180deg, rgba(251,82,113,0.5), rgba(251,82,113,0.2)) 1;
      opacity: 0.5;
    }
    .sabor-info {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      min-width: 0;
    }
    .sabor-nombre {
      color: rgba(255,255,255,0.88);
      font-size: 0.9rem;
      font-weight: 500;
      line-height: 1.35;
    }
    .sabor-stock {
      align-self: flex-start;
      font-family: var(--font-mono);
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      padding: 0.15rem 0.5rem;
      border-radius: 50px;
      background: rgba(255,255,255,0.06);
    }
    .sabor-stock.stock-ok   { color: var(--mint);  background: rgba(45,212,167,0.12); }
    .sabor-stock.stock-warn { color: var(--amber); background: rgba(251,191,36,0.12); }
    .sabor-stock.stock-low  { color: #fb923c;      background: rgba(251,146,60,0.12); }
    .sabor-stock.stock-out  { color: var(--rose);  background: rgba(251,82,113,0.12); }

    .wa-btn {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.5rem 0.9rem;
      background: linear-gradient(135deg, #16a34a, #22c55e);
      border: none;
      border-radius: 50px;
      color: white;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
      box-shadow: 0 3px 10px rgba(34,197,94,0.35);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .wa-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 16px rgba(34,197,94,0.5); }
    .wa-btn:active { transform: translateY(0); }

    /* ── Empty state ── */
    .empty {
      text-align: center;
      padding: 4rem 2rem;
      color: rgba(255,255,255,0.35);
    }
    .empty span { font-size: 3.5rem; display: block; margin-bottom: 0.75rem; opacity: 0.4; }
    .empty p    { font-family: var(--font-mono); font-size: 0.95rem; }

    /* ── Responsive ── */
    @media (min-width: 420px) {
      .card-img { height: 260px; }
    }
  `]
})
export class VaperListPublicComponent implements OnInit {
  /** Número de WhatsApp del negocio, en formato internacional sin '+' ni espacios. */
  private readonly whatsappNumero = '34640635155'; 

  filtroActivo = 'all';
  busqueda = '';
  productos: Producto[] = [];

  filtros = [
    { label: 'Todos',                     value: 'all',      icon: '📦' },
    { label: '120K (6 en 1)',             value: '120k',     icon: '🔥' },
    { label: '140K',                      value: '140k',     icon: '🚀' },
    { label: 'ZOOY SISHA 50K SIN NICOTINA', value: '50k-ZOOY', icon: '💎' },
  ];

  ngOnInit(): void {
    this.productos = this.getProductosData();
  }

  stockTotal(producto: Producto): number {
    return producto.combos.reduce((acc, c) => acc + c.stock, 0);
  }

  pedirLink(producto: Producto, combo: Combo): string {
    const mensaje = `Hola! Quiero pedir: ${producto.nombre} - Combo: ${combo.sabores.join(' + ')} (${producto.precioEur}€)`;
    return `https://wa.me/${this.whatsappNumero}?text=${encodeURIComponent(mensaje)}`;
  }

  get productosFiltrados(): Producto[] {
    let lista = this.productos;

    if (this.filtroActivo !== 'all') {
      lista = lista.filter(p => p.tipo === this.filtroActivo);
    }

    const q = this.busqueda.trim().toLowerCase();
    if (q) {
      lista = lista
        .map(p => ({
          ...p,
          combos: p.combos.filter(c =>
            p.nombre.toLowerCase().includes(q) ||
            c.sabores.some(s => s.toLowerCase().includes(q))
          )
        }))
        .filter(p => p.combos.length > 0);
    }

    return lista;
  }

  getProductosData(): Producto[] {
    return [

      {
        id: 600,
        nombre: 'ZOOY SISHA 50K SIN NICOTINA',
        precioEur: 12,
        tipo: '50k-ZOOY',
        color: 'linear-gradient(135deg, #ef4444, #f97316)',
        emoji: '🥤',
        imagen: 'assets/vapers50ksisha.jpg',
        combos: [
          { id: 6000, sabores: ['🥤 Red Bull'], stock: 1 },
          { id: 6001, sabores: ['🫐❄️ Blueberry Ice'], stock: 6 },
          { id: 6002, sabores: ['🫐⚫❄️ Black Currant Ice'], stock: 7 },
          { id: 6003, sabores: ['🥭🍑🍉 Mango Peach Watermelon'], stock: 2 },
          { id: 6004, sabores: ['🍍🥤 Pineapple Shake'], stock: 2 },
        ]
      },

      {
        id: 314,
        nombre: '140K',
        precioEur: 13,
        tipo: '140k',
        color: 'linear-gradient(135deg, #f97316, #ec4899)',
        emoji: '🍑',
        imagen: 'assets/VAPERS140K.jpg',
        combos: [
          {
            id: 3140,
            sabores: ['🐻🍬 Gummy Bears', '🍓🥭 Strawberry Lychee', '🍉❄️ Watermelon Ice'],
            stock: 6
          },
        ]
      },

      {
        id: 500,
        nombre: '120K (6 en 1)',
        precioEur: 14,
        tipo: '120k',
        color: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
        emoji: '🫐',
        imagen: 'assets/vapers120k6en1.webp',
        combos: [
          {
            id: 5000,
            sabores: ['🫐 Mixed Berry', '🍓🍉 Strawberry Watermelon', '🥝🍍 Kiwi Passion Fruit'],
            stock: 4
          },
          {
            id: 5001,
            sabores: ['🍓🍉 Strawberry Watermelon', '🫐❄️ Blueberry Ice', '🍋🍈 Lemon Lime'],
            stock: 6
          },
          {
            id: 5002,
            sabores: ['🍓🫐 Strawberry Raspberry', '🥭🍑 Mango Peach', '🫐🍉 Blueberry Watermelon'],
            stock: 5
          },
          {
            id: 5003,
            sabores: ['🥝🍍 Kiwi Passion Fruit', '💕 Love 66', '🍋🍓 Pink Lemonade'],
            stock: 6
          },
          {
            id: 5005,
            sabores: ['🍉❄️ Watermelon Ice', '🥤 Red Bull', '🍓🥝 Strawberry Kiwi'],
            stock: 2
          },
          {
            id: 5006,
            sabores: ['🍓🍇 Strawberry Grape', '🫐⚡ Blue Razz', '🍓🍌 Strawberry Banana'],
            stock: 5
          },
        ]
      },

    ];
  }
}