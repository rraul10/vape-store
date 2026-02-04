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
    <div class="catalog-container">
      <!-- Fondo con burbujas animadas -->
      <div class="bubble bubble-1"></div>
      <div class="bubble bubble-2"></div>
      <div class="bubble bubble-3"></div>
      
      <div class="content">
        <!-- Header -->
        <header class="header">
          <div class="logo-wrapper">
            <div class="logo">💨</div>
            <div class="sparkle sparkle-1">✨</div>
            <div class="sparkle sparkle-2">✨</div>
          </div>
          <h1>Mi Stock</h1>
          <p class="tagline">Los mejores sabores</p>
        </header>

        <!-- Filtros -->
        <!-- Filtro select -->
        <div class="filter-select-container">
          <label class="filter-label">Selecciona caladas</label>
          <div class="custom-select">
            <select [(ngModel)]="filtroActivo" class="filter-select">
              <option *ngFor="let f of filtros" [value]="f.value">
                {{ f.icon }} {{ f.label }}
              </option>
            </select>
            <span class="select-arrow">▼</span>
          </div>
        </div>


        <!-- Cards de productos -->
        <div class="cards-grid">
          <div class="vaper-card" *ngFor="let vaper of vapersFiltrados">
            
            <!-- Imagen con overlay de precio y stock -->
            <div class="card-image" [style.background]="vaper.color">
              <img *ngIf="vaper.imagen" 
                   [src]="vaper.imagen" 
                   [alt]="vaper.nombre" 
                   class="product-photo">
              <span *ngIf="!vaper.imagen" class="big-emoji">{{ vaper.emoji }}</span>
              
              <!-- Badge de stock flotante -->
              <div class="stock-badge" 
                   [class.low-stock]="vaper.stock === 1"
                   [class.medium-stock]="vaper.stock === 2"
                   [class.good-stock]="vaper.stock > 2">
                <div class="stock-icon">📦</div>
                <div class="stock-text">
                  <span class="stock-number">{{ vaper.stock }}</span>
                  <span class="stock-label">{{ vaper.stock === 1 ? 'unidad' : 'unidades' }}</span>
                </div>
              </div>
            </div>

            <!-- Info del producto -->
            <div class="card-body">
              <!-- Título y precio -->
              <div class="card-header">
                <h2 class="product-name">{{ vaper.nombre }}</h2>
                <div class="price-bubble">{{ vaper.precioEur }}€</div>
              </div>

              <!-- Separador -->
              <div class="divider"></div>

              <!-- Título de sabores -->
              <div class="flavors-title">
                <span class="title-icon">🌈</span>
                <span class="title-text">Sabores disponibles</span>
              </div>

              <!-- Lista de sabores -->
              <div class="flavors-container">
                <div class="flavor-tag" *ngFor="let sabor of vaper.sabores">
                  {{ sabor }}
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Empty -->
        <div class="empty-box" *ngIf="vapersFiltrados.length === 0">
          <div class="empty-emoji">🔍</div>
          <p>No hay productos en esta categoría</p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    * { 
      box-sizing: border-box; 
      margin: 0; 
      padding: 0; 
    }
    
    .catalog-container {
      min-height: 100vh;
      background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%);
      position: relative;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      overflow-x: hidden;
      padding-bottom: 2rem;
    }

    /* Burbujas de fondo */
    .bubble {
      position: fixed;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.15;
      pointer-events: none;
      animation: float 20s ease-in-out infinite;
    }

    .bubble-1 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, #8b5cf6, transparent);
      top: 10%;
      left: -10%;
      animation-delay: 0s;
    }

    .bubble-2 {
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, #ec4899, transparent);
      top: 50%;
      right: -10%;
      animation-delay: 5s;
    }

    .bubble-3 {
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, #3b82f6, transparent);
      bottom: 20%;
      left: 50%;
      animation-delay: 10s;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -30px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
    }

    .content {
      position: relative;
      max-width: 500px;
      margin: 0 auto;
      padding: 1rem;
      z-index: 1;
    }

    /* ========== HEADER ========== */
    .header {
      text-align: center;
      padding: 2rem 0 1.5rem;
      position: relative;
    }

    .logo-wrapper {
      position: relative;
      display: inline-block;
      margin-bottom: 1rem;
    }

    .logo {
      font-size: 4rem;
      filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6));
      animation: bounce 2s ease-in-out infinite;
      display: inline-block;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }

    .sparkle {
      position: absolute;
      font-size: 1.25rem;
      animation: sparkle 2s ease-in-out infinite;
    }

    .sparkle-1 {
      top: 0;
      right: -10px;
      animation-delay: 0.5s;
    }

    .sparkle-2 {
      bottom: 0;
      left: -10px;
      animation-delay: 1s;
    }

    @keyframes sparkle {
      0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
      50% { opacity: 1; transform: scale(1) rotate(180deg); }
    }

    .header h1 {
      font-size: 2.5rem;
      font-weight: 900;
      background: linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #f9a8d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.03em;
      margin-bottom: 0.25rem;
    }

    .tagline {
      color: rgba(255,255,255,0.5);
      font-size: 0.95rem;
      font-weight: 500;
    }

    /* ========== FILTROS ========== */
    .filters-scroll {
      display: flex;
      gap: 0.625rem;
      overflow-x: auto;
      padding: 0.75rem 0 1.75rem;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .filters-scroll::-webkit-scrollbar {
      display: none;
    }

    .filter-pill {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      border: 2px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(10px);
      color: rgba(255,255,255,0.7);
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
    }

    .pill-emoji {
      font-size: 1.15rem;
    }

    .filter-pill.active {
      background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
      border-color: transparent;
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.5);
    }

    /* ========== CARDS ========== */
    .cards-grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .vaper-card {
      background: rgba(255,255,255,0.06);
      border: 2px solid rgba(255,255,255,0.12);
      border-radius: 2rem;
      overflow: hidden;
      box-shadow: 
        0 10px 40px rgba(0,0,0,0.4),
        inset 0 1px 0 rgba(255,255,255,0.1);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .vaper-card:active {
      transform: scale(0.97);
    }

    /* Imagen con gradiente */
    .card-image {
      position: relative;
      height: 260px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
    }

    .product-photo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 2rem;
      filter: drop-shadow(0 10px 25px rgba(0,0,0,0.4));
      transition: transform 0.4s ease;
    }

    .vaper-card:active .product-photo {
      transform: scale(1.05);
    }

    .big-emoji {
      font-size: 6rem;
      filter: drop-shadow(0 10px 30px rgba(0,0,0,0.5));
    }

    /* Badge de stock flotante */
    .stock-badge {
      position: absolute;
      bottom: 1.25rem;
      right: 1.25rem;
      background: rgba(0,0,0,0.8);
      backdrop-filter: blur(20px);
      border-radius: 1.25rem;
      padding: 0.875rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border: 2px solid rgba(255,255,255,0.15);
      box-shadow: 0 8px 30px rgba(0,0,0,0.6);
      transition: all 0.3s ease;
    }

    .stock-icon {
      font-size: 1.75rem;
    }

    .stock-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .stock-number {
      font-size: 1.5rem;
      font-weight: 900;
      color: white;
    }

    .stock-label {
      font-size: 0.7rem;
      color: rgba(255,255,255,0.6);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }

    /* Colores de stock */
    .good-stock {
      border-color: rgba(34, 197, 94, 0.5);
      background: rgba(0,0,0,0.85);
    }
    .good-stock .stock-number {
      color: #22c55e;
      text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
    }

    .medium-stock {
      border-color: rgba(251, 191, 36, 0.5);
      background: rgba(0,0,0,0.85);
      animation: pulse-warning 2s infinite;
    }
    .medium-stock .stock-number {
      color: #fbbf24;
      text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
    }

    .low-stock {
      border-color: rgba(239, 68, 68, 0.6);
      background: rgba(0,0,0,0.9);
      animation: pulse-danger 1.5s infinite;
    }
    .low-stock .stock-number {
      color: #ef4444;
      text-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
    }

    @keyframes pulse-warning {
      0%, 100% { box-shadow: 0 8px 30px rgba(251, 191, 36, 0.3); }
      50% { box-shadow: 0 8px 30px rgba(251, 191, 36, 0.6); }
    }

    @keyframes pulse-danger {
      0%, 100% { box-shadow: 0 8px 30px rgba(239, 68, 68, 0.4); }
      50% { box-shadow: 0 8px 30px rgba(239, 68, 68, 0.7); }
    }

    /* Body de la card */
    .card-body {
      padding: 1.75rem;
      background: rgba(0,0,0,0.2);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .product-name {
      color: white;
      font-size: 1.5rem;
      font-weight: 900;
      letter-spacing: -0.02em;
      flex: 1;
    }

    .price-bubble {
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      color: white;
      padding: 0.75rem 1.25rem;
      border-radius: 50px;
      font-size: 1.35rem;
      font-weight: 900;
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
      white-space: nowrap;
    }

    /* Separador */
    .divider {
      height: 1px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255,255,255,0.2) 50%, 
        transparent 100%);
      margin-bottom: 1.25rem;
    }

    /* Título de sabores */
    .flavors-title {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      margin-bottom: 1rem;
    }

    .title-icon {
      font-size: 1.25rem;
    }

    .title-text {
      font-size: 0.85rem;
      color: rgba(255,255,255,0.6);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
    }

    /* Sabores */
    .flavors-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .flavor-tag {
  padding: 0.35rem 0;
  color: rgba(255,255,255,0.85);
  font-size: 1rem;
  font-weight: 500;
  border-left: 3px solid rgba(139, 92, 246, 0.6);
  padding-left: 0.75rem;
}


    .flavor-tag:active {
      transform: translateX(5px);
      background: linear-gradient(135deg, 
        rgba(139, 92, 246, 0.25), 
        rgba(236, 72, 153, 0.15));
    }

    /* Empty state */
    .empty-box {
      text-align: center;
      padding: 4rem 2rem;
      color: rgba(255,255,255,0.4);
    }

    .empty-emoji {
      font-size: 4.5rem;
      margin-bottom: 1rem;
      opacity: 0.3;
    }

    .empty-box p {
      font-size: 1.05rem;
    }

    /* ========== RESPONSIVE ========== */
    @media (min-width: 420px) {
      .card-image {
        height: 280px;
      }

      .big-emoji {
        font-size: 6.5rem;
      }
    }
      /* ========== SELECT FILTRO ========== */
.filter-select-container {
  margin-bottom: 2rem;
}

.filter-label {
  display: block;
  margin-bottom: 0.5rem;
  color: rgba(255,255,255,0.6);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
}

.custom-select {
  position: relative;
}

.filter-select {
  width: 100%;
  padding: 1rem 3rem 1rem 1.25rem;
  border-radius: 1.25rem;
  border: 2px solid rgba(255,255,255,0.15);
  background: rgba(0,0,0,0.4);
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:hover {
  border-color: rgba(139, 92, 246, 0.6);
}

.filter-select:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
}

.select-arrow {
  position: absolute;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: rgba(255,255,255,0.5);
  font-size: 0.85rem;
}

  `]
})
export class VaperListPublicComponent implements OnInit {
  filtroActivo = 'all';
  vapers: Vaper[] = [];

  filtros = [
    { label: 'Todos', value: 'all', icon: '📦' },
    { label: '85K', value: '85k', icon: '🟣' },
    { label: '80K', value: '80k', icon: '⚡' },
    { label: 'ZOOY 30K', value: '30k-ZOOY', icon: '🦁' },
  ];

  constructor() {}

  ngOnInit(): void {
    this.vapers = this.getVapersData();
  }

  getVapersData(): Vaper[] {
    return [
      // ===== 85K =====
      {
        id: 27,
        nombre: 'Bang King 85K',
        precio: 120000,
        precioEur: 13,
        stock: 2,
        tipo: '85k',
        color: 'linear-gradient(135deg, #f472b6, #ec4899)',
        emoji: '🍍',
        imagen: 'assets/85BangKing.jpg',
        sabores: [
          '🥭🍍 Tropical Fruit',
          '🍋🍑 Lemon Peach',
          '🍓🍉 Strawberry Watermelon'
        ]
      },
      {
        id: 28,
        nombre: 'Bang King 85K',
        precio: 120000,
        precioEur: 13,
        stock: 1,
        tipo: '85k',
        color: 'linear-gradient(135deg, #a3e635, #65a30d)',
        emoji: '🍏',
        imagen: 'assets/85BangKing.jpg',
        sabores: [
          '🍎🍏 Double Apple',
          '🍍❄️ Pineapple Ice',
          '🍹🍓 Fruity Fusion'
        ]
      },

      // ===== ZOOY 30K =====
      {
        id: 61,
        nombre: 'ZOOY 30K',
        precio: 90000,
        precioEur: 10,
        stock: 3,
        tipo: '30k-ZOOY',
        color: 'linear-gradient(135deg, #38bdf8, #0284c7)',
        emoji: '🍦',
        imagen: 'assets/30kzooy.jpg',
        sabores: [
          '🍓🍦 Strawberry Ice Cream',
          '🍑🥭 Peach Mango Milkshake'
        ]
      },
      {
        id: 62,
        nombre: 'ZOOY 30K',
        precio: 90000,
        precioEur: 10,
        stock: 1,
        tipo: '30k-ZOOY',
        color: 'linear-gradient(135deg, #a7f3d0, #059669)',
        emoji: '🍇',
        imagen: 'assets/30kzooy.jpg',
        sabores: [
          '🍇❄️ Grape Mint',
          '🍓🍌 Strawberry Banana'
        ]
      },
      {
        id: 63,
        nombre: 'ZOOY 30K',
        precio: 90000,
        precioEur: 10,
        stock: 1,
        tipo: '30k-ZOOY',
        color: 'linear-gradient(135deg, #fca5a5, #dc2626)',
        emoji: '❤️',
        imagen: 'assets/30kzooy.jpg',
        sabores: [
          '❤️ Love 66',
          '🥤❄️ Cola Ice'
        ]
      },
      {
        id: 64,
        nombre: 'ZOOY 30K',
        precio: 90000,
        precioEur: 10,
        stock: 2,
        tipo: '30k-ZOOY',
        color: 'linear-gradient(135deg, #fde047, #f59e0b)',
        emoji: '⚡',
        imagen: 'assets/30kzooy.jpg',
        sabores: [
          '⚡ Red Bull',
          '🍓🥝 Strawberry Kiwi'
        ]
      },
      // ===== 80K =====
      {
        id: 29,
        nombre: '80K',
        precio: 115000,
        precioEur: 14,
        stock: 2,
        tipo: '80k',
        color: 'linear-gradient(135deg, #60a5fa, #2563eb)',
        emoji: '🫐',
        imagen: 'assets/80BangKing.jpg',
        sabores: [
          '🫐❄️ Triple Berry Ice',
          '🥭🍑 Mango Peach',
          '🍓🥝 Strawberry Kiwi'
        ]
      },
      {
        id: 30,
        nombre: '80K',
        precio: 115000,
        precioEur: 14,
        stock: 2,
        tipo: '80k',
        color: 'linear-gradient(135deg, #4ade80, #16a34a)',
        emoji: '🍉',
        imagen: 'assets/80BangKing.jpg',
        sabores: [
          '🍉❄️ Watermelon Ice',
          '🍓🍦 Strawberry Ice Cream',
          '🍈🍈 Triple Melon'
        ]
      },
      {
        id: 31,
        nombre: '80K',
        precio: 115000,
        precioEur: 14,
        stock: 1,
        tipo: '80k',
        color: 'linear-gradient(135deg, #f472b6, #be185d)',
        emoji: '🥤',
        imagen: 'assets/80BangKing.jpg',
        sabores: [
          '🍓🥤 Strawberry Vanilla Cola',
          '🍏🫐 Sour Apple Raspberry',
          '🍋🟢 Lemon Lime'
        ]
      },
      {
        id: 32,
        nombre: '80K',
        precio: 115000,
        precioEur: 14,
        stock: 1,
        tipo: '80k',
        color: 'linear-gradient(135deg, #fde047, #f59e0b)',
        emoji: '🧃',
        imagen: 'assets/80BangKing.jpg',
        sabores: [
          '🍋🥤 Lemon Cola Soda',
          '🍉🍬 Watermelon Gum',
          '🐉❄️ Black Dragon Ice'
        ]
      },
      {
        id: 33,
        nombre: '80K',
        precio: 115000,
        precioEur: 14,
        stock: 1,
        tipo: '80k',
        color: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
        emoji: '🍍',
        imagen: 'assets/80BangKing.jpg',
        sabores: [
          '🍍🥥 Pineapple Coconut',
          '🍓🍬 Strawberry Raspberry Candy',
          '🧊💙 Blue Razz Ice'
        ]
      },
    ];
  }

  get vapersFiltrados(): Vaper[] {
    if (this.filtroActivo === 'all') return this.vapers;
    return this.vapers.filter(v => v.tipo === this.filtroActivo);
  }
}