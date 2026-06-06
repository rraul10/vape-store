import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Vaper {
  id: number;
  nombre: string;
  precio: number;
  precioEur: number;
  stock: number;
  tipo: string;
  color: string;
  emoji: string;
  imagen?: string;
  sabores: string[];
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
          <div class="logo">💨</div>
          <h1>Stock Vapers</h1>
        </header>

        <!-- Filtro -->
        <div class="filter-wrap">
          <label class="filter-label">Filtrar por caladas</label>
          <div class="select-wrap">
            <select [(ngModel)]="filtroActivo" class="filter-select">
              <option *ngFor="let f of filtros" [value]="f.value">
                {{ f.icon }} {{ f.label }}
              </option>
            </select>
            <span class="arrow">▼</span>
          </div>
        </div>

        <!-- Contador -->
        <p class="count">{{ vapersFiltrados.length }} producto{{ vapersFiltrados.length !== 1 ? 's' : '' }}</p>

        <!-- Cards -->
        <div class="grid">
          <div class="card" *ngFor="let vaper of vapersFiltrados">

            <!-- Imagen -->
            <div class="card-img" [style.background]="vaper.color">
              <img *ngIf="vaper.imagen"
                   [src]="vaper.imagen"
                   [alt]="vaper.nombre"
                   class="photo">
              <span *ngIf="!vaper.imagen" class="emoji-big">{{ vaper.emoji }}</span>

              <!-- Stock badge -->
              <div class="stock-badge"
                   [class.stock-ok]="vaper.stock > 2"
                   [class.stock-warn]="vaper.stock === 2"
                   [class.stock-low]="vaper.stock === 1">
                📦
                <span class="stock-num">{{ vaper.stock }}</span>
                <span class="stock-lbl">{{ vaper.stock === 1 ? 'ud.' : 'uds.' }}</span>
              </div>
            </div>

            <!-- Cuerpo -->
            <div class="card-body">

              <div class="card-top">
                <h2 class="name">{{ vaper.nombre }}</h2>
                <span class="price">{{ vaper.precioEur }}€</span>
              </div>

              <hr class="sep">

              <p class="flavors-label">🌈 Sabores disponibles</p>
              <ul class="flavors">
                <li *ngFor="let s of vaper.sabores">{{ s }}</li>
              </ul>

            </div>
          </div>
        </div>

        <!-- Empty -->
        <div class="empty" *ngIf="vapersFiltrados.length === 0">
          <span>🔍</span>
          <p>No hay productos en esta categoría</p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* ── Reset ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Contenedor principal ── */
    .catalog {
      min-height: 100vh;
      background: linear-gradient(180deg, #0f0f23, #1a1a2e);
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
    .logo {
      font-size: 3.5rem;
      display: block;
      margin-bottom: 0.75rem;
      filter: drop-shadow(0 0 18px rgba(139, 92, 246, 0.5));
      animation: bounce 3s ease-in-out infinite;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-12px); }
    }
    h1 {
      font-size: clamp(2rem, 6vw, 2.75rem);
      font-weight: 900;
      background: linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #f9a8d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.03em;
    }

    /* ── Filtro ── */
    .filter-wrap   { margin-bottom: 0.5rem; }
    .filter-label  {
      display: block;
      margin-bottom: 0.4rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: rgba(255,255,255,0.5);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .select-wrap   { position: relative; }
    .filter-select {
      width: 100%;
      padding: 0.9rem 3rem 0.9rem 1.25rem;
      background: rgba(0,0,0,0.4);
      border: 2px solid rgba(255,255,255,0.12);
      border-radius: 1rem;
      color: white;
      font-size: 1rem;
      font-weight: 700;
      appearance: none;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .filter-select:hover  { border-color: rgba(139,92,246,0.55); }
    .filter-select:focus  { outline: none; border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139,92,246,0.25); }
    .arrow {
      position: absolute;
      right: 1.1rem;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: rgba(255,255,255,0.45);
      font-size: 0.8rem;
    }

    /* ── Contador ── */
    .count {
      font-size: 0.8rem;
      color: rgba(255,255,255,0.35);
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
      background: rgba(255,255,255,0.06);
      border: 1.5px solid rgba(255,255,255,0.1);
      border-radius: 1.75rem;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
      transition: transform 0.2s ease;
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
    .photo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 2rem;
      filter: drop-shadow(0 8px 20px rgba(0,0,0,0.4));
      transition: transform 0.3s ease;
    }
    .card:active .photo { transform: scale(1.04); }
    .emoji-big { font-size: 5.5rem; }

    /* Stock badge */
    .stock-badge {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1rem;
      background: rgba(0,0,0,0.8);
      backdrop-filter: blur(16px);
      border-radius: 1rem;
      border: 1.5px solid rgba(255,255,255,0.12);
      font-size: 1.25rem;
    }
    .stock-num {
      font-size: 1.35rem;
      font-weight: 900;
      color: white;
    }
    .stock-lbl {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 700;
      color: rgba(255,255,255,0.55);
    }

    /* Colores de stock */
    .stock-ok   { border-color: rgba(34,197,94,0.45); }
    .stock-ok   .stock-num { color: #22c55e; }
    .stock-warn { border-color: rgba(251,191,36,0.45); animation: pulse-warn 2s infinite; }
    .stock-warn .stock-num { color: #fbbf24; }
    .stock-low  { border-color: rgba(239,68,68,0.55); animation: pulse-low 1.5s infinite; }
    .stock-low  .stock-num { color: #ef4444; }

    @keyframes pulse-warn {
      0%, 100% { box-shadow: 0 4px 20px rgba(251,191,36,0.2); }
      50%       { box-shadow: 0 4px 20px rgba(251,191,36,0.5); }
    }
    @keyframes pulse-low {
      0%, 100% { box-shadow: 0 4px 20px rgba(239,68,68,0.25); }
      50%       { box-shadow: 0 4px 20px rgba(239,68,68,0.6); }
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
      font-size: 1.4rem;
      font-weight: 900;
      letter-spacing: -0.02em;
      flex: 1;
    }
    .price {
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      color: white;
      padding: 0.6rem 1.1rem;
      border-radius: 50px;
      font-size: 1.25rem;
      font-weight: 900;
      white-space: nowrap;
      box-shadow: 0 4px 14px rgba(139,92,246,0.4);
    }

    .sep {
      border: none;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin-bottom: 1rem;
    }

    .flavors-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(255,255,255,0.5);
      margin-bottom: 0.75rem;
    }

    .flavors {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }
    .flavors li {
      padding: 0.3rem 0 0.3rem 0.75rem;
      border-left: 3px solid rgba(139,92,246,0.55);
      color: rgba(255,255,255,0.85);
      font-size: 0.95rem;
      font-weight: 500;
    }

    /* ── Empty state ── */
    .empty {
      text-align: center;
      padding: 4rem 2rem;
      color: rgba(255,255,255,0.35);
    }
    .empty span { font-size: 3.5rem; display: block; margin-bottom: 0.75rem; opacity: 0.4; }
    .empty p    { font-size: 1rem; }

    /* ── Responsive ── */
    @media (min-width: 420px) {
      .card-img { height: 260px; }
    }
  `]
})
export class VaperListPublicComponent implements OnInit {
  filtroActivo = 'all';
  vapers: Vaper[] = [];

  filtros = [
    { label: 'Todos',          value: 'all',      icon: '📦' },
    { label: '120K (6 en 1)', value: '120k',      icon: '🔥' },
    { label: '140K',           value: '140k',      icon: '🚀' },
    { label: 'ZOOY SISHA 50K SIN NICOTINA', value: '50k-ZOOY', icon: '💎' },
  ];

  ngOnInit(): void {
    this.vapers = this.getVapersData();
  }

  getVapersData(): Vaper[] {
    return [

      // ── 140K ─────────────────────────────────────────────────────
      {
        id: 307,
        nombre: '140K',
        precio: 130000,
        precioEur: 13,
        stock: 1,
        tipo: '140k',
        color: 'linear-gradient(135deg, #7c3aed, #f472b6)',
        emoji: '🫐',
        imagen: 'assets/VAPERS140K.jpg',
        sabores: [
          '🍇🍍 Blackcurrant Pineapple Ice',
          '🫐🍑 Blueberry Peach',
          '🍓🍉 Strawberry Watermelon',
        ]
      },
      {
        id: 314,
        nombre: '140K',
        precio: 130000,
        precioEur: 13,
        stock: 11,
        tipo: '140k',
        color: 'linear-gradient(135deg, #f97316, #ec4899)',
        emoji: '🍑',
        imagen: 'assets/VAPERS140K.jpg',
        sabores: [
          '🐻🍬 Gummy Bears',
          '🍓🥭 Strawberry Lychee',
          '🍉❄️ Watermelon Ice',
        ]
      },

      {
        id: 402,
        nombre: 'ZOOY SISHA 50K',
        precio: 12,
        precioEur: 12,
        stock: 1,
        tipo: '50k-ZOOY',
        color: 'linear-gradient(135deg, #8b5cf6, #ef4444)',
        emoji: '🫐',
        imagen: 'assets/vapers50ksisha.jpg',
        sabores: ['🫐🍒 Blue Razz Cherry']
      },

      // ── ZOOY SISHA 50K ─────────────────────────────────────────────
      {
        id: 402,
        nombre: 'ZOOY SISHA 50K',
        precio: 12,
        precioEur: 12,
        stock: 5,
        tipo: '50k-ZOOY',
        color: 'linear-gradient(135deg, #8b5cf6, #ef4444)',
        emoji: '🥤',
        imagen: 'assets/vapers50ksisha.jpg',
        sabores: ['🥤 Red Bull']
      },
      {
        id: 403,
        nombre: 'ZOOY SISHA 50K',
        precio: 12,
        precioEur: 12,
        stock: 5,
        tipo: '50k-ZOOY',
        color: 'linear-gradient(135deg, #fbbf24, #f97316)',
        emoji: '🍍',
        imagen: 'assets/vapers50ksisha.jpg',
        sabores: ['🍍🥤 Pineapple Shake']
      },
      {
        id: 404,
        nombre: 'ZOOY SISHA 50K',
        precio: 12,
        precioEur: 12,
        stock: 4,
        tipo: '50k-ZOOY',
        color: 'linear-gradient(135deg, #fb923c, #38bdf8)',
        emoji: '🥭',
        imagen: 'assets/vapers50ksisha.jpg',
        sabores: ['🥭🍑🍉 Mango Peach Watermelon']
      },
      {
        id: 405,
        nombre: 'ZOOY SISHA 50K',
        precio: 12,
        precioEur: 12,
        stock: 5,
        tipo: '50k-ZOOY',
        color: 'linear-gradient(135deg, #6366f1, #312e81)',
        emoji: '🫐',
        imagen: 'assets/vapers50ksisha.jpg',
        sabores: ['🫐❄️ Black Currant Ice']
      },
      {
        id: 406,
        nombre: 'ZOOY SISHA 50K',
        precio: 12,
        precioEur: 12,
        stock: 5,
        tipo: '50k-ZOOY',
        color: 'linear-gradient(135deg, #3b82f6, #ec4899)',
        emoji: '🫐',
        imagen: 'assets/vapers50ksisha.jpg',
        sabores: ['🫐🍓 Blueberry Raspberry']
      },

      // ── 120K (6 en 1) ────────────────────────────────────────────
      {
        id: 500,
        nombre: '120K (6 en 1)',
        precio: 14,
        precioEur: 14,
        stock: 6,
        tipo: '120k',
        color: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
        emoji: '🫐',
        imagen: 'assets/vapers120k6en1.webp',
        sabores: [
          '🫐 Mixed Berry',
          '🍓🍉 Strawberry Watermelon',
          '🥝🍍 Kiwi Passion Fruit',
        ]
      },
      {
        id: 501,
        nombre: '120K (6 en 1)',
        precio: 14,
        precioEur: 14,
        stock: 6,
        tipo: '120k',
        color: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
        emoji: '❄️',
        imagen: 'assets/vapers120k6en1.webp',
        sabores: [
          '🍓🍉 Strawberry Watermelon',
          '🫐❄️ Blueberry Ice',
          '🍋🍈 Lemon Lime',
        ]
      },
      {
        id: 502,
        nombre: '120K (6 en 1)',
        precio: 14,
        precioEur: 14,
        stock: 6,
        tipo: '120k',
        color: 'linear-gradient(135deg, #f97316, #ec4899)',
        emoji: '🥭',
        imagen: 'assets/vapers120k6en1.webp',
        sabores: [
          '🍓🫐 Strawberry Raspberry',
          '🥭🍑 Mango Peach',
          '🫐🍉 Blueberry Watermelon',
        ]
      },
      {
        id: 503,
        nombre: '120K (6 en 1)',
        precio: 14,
        precioEur: 14,
        stock: 6,
        tipo: '120k',
        color: 'linear-gradient(135deg, #22c55e, #f472b6)',
        emoji: '💕',
        imagen: 'assets/vapers120k6en1.webp',
        sabores: [
          '🥝🍍 Kiwi Passion Fruit',
          '💕 Love 66',
          '🍋🍓 Pink Lemonade',
        ]
      },
      {
        id: 504,
        nombre: '120K (6 en 1)',
        precio: 14,
        precioEur: 14,
        stock: 5,
        tipo: '120k',
        color: 'linear-gradient(135deg, #fb7185, #f59e0b)',
        emoji: '🍑',
        imagen: 'assets/vapers120k6en1.webp',
        sabores: [
          '🍑🫐 Peach Berry',
          '🍓🥭 Strawberry Mango',
          '🍒🥤❄️ Cherry Cola Ice',
        ]
      },

      {
        id: 505,
        nombre: '120K (6 en 1)',
        precio: 14,
        precioEur: 14,
        stock: 6,
        tipo: '120k',
        color: 'linear-gradient(135deg, #06b6d4, #ef4444)',
        emoji: '🍉',
        imagen: 'assets/vapers120k6en1.webp',
        sabores: [
          '🍉❄️ Watermelon Ice',
          '🥤 Red Bull',
          '🍓🥝 Strawberry Kiwi',
        ]
      },


    ];
  }

  get vapersFiltrados(): Vaper[] {
    if (this.filtroActivo === 'all') return this.vapers;
    return this.vapers.filter(v => v.tipo === this.filtroActivo);
  }
}