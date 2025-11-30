import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  template: `
    <div class="catalog-container">
      <!-- Fondo animado sutil -->
      <div class="bg-glow"></div>
      
      <div class="content">
        <!-- Header mejorado -->
        <header class="header">
          <div class="logo-badge">🌬️</div>
          <h1>Vaper Stock</h1>
          
        </header>

        <!-- Filtros pill-style -->
        <div class="filters-section">
          <div class="filters-scroll">
            <button 
              *ngFor="let f of filtros" 
              class="filter-pill"
              [class.active]="filtroActivo === f.value"
              (click)="filtroActivo = f.value">
              <span class="filter-icon">{{ f.icon }}</span>
              <span class="filter-text">{{ f.label }}</span>
            </button>
          </div>
        </div>

        <!-- Grid de productos -->
        <div class="products-grid">
          <article class="product-card" *ngFor="let vaper of vapersFiltrados">
            <!-- Imagen/Emoji del producto -->
            <div class="product-visual">
              <img *ngIf="vaper.imagen" [src]="vaper.imagen" [alt]="vaper.nombre" class="product-image">
              <span *ngIf="!vaper.imagen" class="product-emoji">{{ vaper.emoji }}</span>
              <div class="price-badge">{{ vaper.precioEur }}€</div>
            </div>

            <!-- Info del producto -->
            <div class="product-info">
              <h3 class="product-name">{{ vaper.nombre }}</h3>
              
              <!-- Stock indicator -->
              <div class="stock-indicator" 
                   [class.stock-low]="vaper.stock <= 1" 
                   [class.stock-medium]="vaper.stock === 2"
                   [class.stock-good]="vaper.stock > 2">
                <div class="stock-bar">
                  <div class="stock-fill" [style.width.%]="getStockPercent(vaper.stock)"></div>
                </div>
                <div class="stock-text">
                  <span>{{ vaper.stock }} {{ vaper.stock === 1 ? 'unidad' : 'unidades' }}</span>
                </div>
              </div>

              <!-- Lista de sabores siempre visible -->
              <div class="flavors-list">
                <div class="flavors-grid-visible">
                  <span class="flavor-chip" *ngFor="let sabor of vaper.sabores">
                    {{ sabor }}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty state -->
        <div class="empty-state" *ngIf="vapersFiltrados.length === 0">
          <span class="empty-icon">🔍</span>
          <p>No hay productos en esta categoría</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    .catalog-container {
      min-height: 100vh;
      min-height: 100dvh;
      background: #0f0f1a;
      position: relative;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      overflow-x: hidden;
    }

    .bg-glow {
      position: fixed;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: 
        radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 70% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
      pointer-events: none;
      animation: slowRotate 60s linear infinite;
    }

    @keyframes slowRotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .content {
      position: relative;
      max-width: 600px;
      margin: 0 auto;
      padding: 1.5rem 1rem 2rem;
    }

    /* ========== HEADER ========== */
    .header {
      text-align: center;
      padding: 1rem 0 2rem;
    }

    .logo-badge {
      font-size: 3rem;
      margin-bottom: 0.75rem;
      display: block;
      filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5));
    }

    .header h1 {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #f9a8d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: rgba(255,255,255,0.5);
      font-size: 1rem;
      font-weight: 400;
      margin-bottom: 1.5rem;
    }

    .stats-row {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .stat-badge {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 1rem;
      padding: 0.75rem 1.25rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 90px;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
    }

    .stat-label {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.5);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* ========== FILTROS ========== */
    .filters-section {
      margin-bottom: 1.5rem;
      margin-left: -1rem;
      margin-right: -1rem;
      padding: 0 1rem;
    }

    .filters-scroll {
      display: flex;
      gap: 0.625rem;
      overflow-x: auto;
      padding: 0.25rem;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .filters-scroll::-webkit-scrollbar { display: none; }

    .filter-pill {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border-radius: 100px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.03);
      color: rgba(255,255,255,0.7);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .filter-pill:active { transform: scale(0.96); }

    .filter-pill.active {
      background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
      border-color: transparent;
      color: white;
      box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
    }

    .filter-icon { font-size: 1.1rem; }

    /* ========== PRODUCTOS GRID ========== */
    .products-grid {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .product-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 1.25rem;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .product-card:active {
      transform: scale(0.98);
    }

    /* Visual del producto */
    .product-visual {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: rgba(255,255,255,0.02);
    }

    .product-emoji {
      font-size: 4rem;
      filter: drop-shadow(0 8px 16px rgba(0,0,0,0.3));
      transition: transform 0.3s ease;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 1.5rem;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image,
    .product-card:hover .product-emoji {
      transform: scale(1.05);
    }

    .price-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(10px);
      padding: 0.5rem 1rem;
      border-radius: 100px;
      color: white;
      font-size: 1.1rem;
      font-weight: 700;
    }

    /* Info del producto */
    .product-info {
      padding: 1.25rem;
    }

    .product-name {
      color: white;
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 1rem;
      letter-spacing: -0.01em;
    }

    /* Stock indicator */
    .stock-indicator {
      margin-bottom: 1rem;
    }

    .stock-bar {
      height: 4px;
      background: rgba(255,255,255,0.1);
      border-radius: 100px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .stock-fill {
      height: 100%;
      border-radius: 100px;
      transition: width 0.5s ease;
    }

    .stock-good .stock-fill { background: linear-gradient(90deg, #34d399, #10b981); }
    .stock-medium .stock-fill { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
    .stock-low .stock-fill { background: linear-gradient(90deg, #f87171, #ef4444); }

    .stock-text {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      color: rgba(255,255,255,0.6);
    }

    .stock-badge-mini {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
      padding: 0.2rem 0.6rem;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 600;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    /* Lista de sabores siempre visible */
    .flavors-list {
      margin-top: 0.5rem;
    }

    .flavors-grid-visible {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .flavor-chip {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 0.5rem 0.875rem;
      border-radius: 100px;
      font-size: 0.85rem;
      color: rgba(255,255,255,0.85);
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: rgba(255,255,255,0.5);
    }

    .empty-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    /* Footer */
    .footer {
      margin-top: 2.5rem;
      padding: 1.5rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .footer-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: rgba(255,255,255,0.6);
      font-size: 0.9rem;
    }

    .footer-icon {
      font-size: 1.25rem;
    }

    /* ========== RESPONSIVE ========== */
    @media (min-width: 480px) {
      .content { padding: 2rem 1.5rem; }
      .header h1 { font-size: 2.5rem; }
      .products-grid { gap: 1.5rem; }
      .product-visual { height: 240px; }
      .product-emoji { font-size: 5rem; }
      .footer { flex-direction: row; justify-content: center; gap: 2rem; }
    }

    @media (min-width: 768px) {
      .products-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class VaperListPublicComponent implements OnInit {
  filtroActivo = 'all';
  saboresAbiertos: { [key: number]: boolean } = {};
  vapers: Vaper[] = [];

 filtros = [
  { label: 'Todos', value: 'all', icon: '' },
  { label: '80K ZOOY', value: '80k-ZOOY', icon: '' },
  { label: '85K BANG', value: '85k-BANG', icon: '' },
  { label: '85K', value: '85k', icon: '' },
  { label: '80K 12€', value: '80k-RUNCHUNFU', icon: '' } 
];

  constructor() {}

  ngOnInit(): void {
    this.vapers = this.getVapersData();
  }

  getVapersData(): Vaper[] {
    return [
      // 80K ZOOY - 15€
      {
        id: 1,
        nombre: 'Tropical Mix',
        precio: 80000,
        precioEur: 15,
        stock: 1,
        tipo: '80k-ZOOY',
        color: 'linear-gradient(135deg, #3b82f6, #1e40af)',
        emoji: '🔵',
        imagen: 'assets/80k-zooy.jpg', 
        sabores: ['🍍 Tropical Fruit', '🍓🍉 Strawberry Watermelon', '🍓🥭 Strawberry Mango']
      },
      {
        id: 2,
        nombre: 'Berry Paradise',
        precio: 80000,
        precioEur: 15,
        stock: 1,
        tipo: '80k-ZOOY',
        color: 'linear-gradient(135deg, #06b6d4, #0891b2)',
        emoji: '🔵',
        imagen: 'assets/80k-zooy.jpg', 
        sabores: ['🥝 Kiwi Passion Fruit', '🍓🍌 Strawberry Banana', '🔵 Blue Razz']
      },
      // 85K BANG - 15€
      {
        id: 3,
        nombre: 'Energy Blast',
        precio: 85000,
        precioEur: 15,
        stock: 1,
        tipo: '85k-BANG',
        color: 'linear-gradient(135deg, #ef4444, #dc2626)',
        emoji: '💥',
        imagen: 'assets/85k.jpg',
        sabores: ['🍻 RedBull', '🫐🍉 Blueberry Watermelon', '🍓🍨 Strawberry Ice Cream']
      },
      {
        id: 5,
        nombre: 'Grape Sensation',
        precio: 85000,
        precioEur: 15,
        stock: 2,
        tipo: '85k-BANG',
        color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        emoji: '💥',
        imagen: 'assets/85k.jpg',
        sabores: ['🟣 Grape Ice', '🍓🥝 Strawberry Kiwi', '🟠 Passion Fruit Guava']
      },

      {
        id: 13,
        nombre: 'Berry Explosion',
        precio: 85000,
        precioEur: 15,
        stock: 2,
        tipo: '85k-BANG',
        color: 'linear-gradient(135deg, #f87171, #b91c1c)',
        emoji: '💥',
        imagen: 'assets/85k.jpg',
        sabores: ['🍓 Strawberry Raspberry', '🫐 Black Currant', '🍓🍌 Strawberry Banana']
      },
      // 85K Normal - 15€
      {
        id: 6,
        nombre: 'Citrus Fusion',
        precio: 85000,
        precioEur: 15,
        stock: 1,
        tipo: '85k',
        color: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
        emoji: '🟣',
        imagen: 'assets/85BangKing.jpg',
        sabores: ['🍍 Tropical Fruit', '🍋🍑 Lemon Peach', '🍓🍉 Strawberry Watermelon']
      },
      {
        id: 7,
        nombre: 'Island Breeze',
        precio: 85000,
        precioEur: 15,
        stock: 1,
        tipo: '85k',
        color: 'linear-gradient(135deg, #c084fc, #a855f7)',
        emoji: '🟣',
        imagen: 'assets/85BangKing.jpg',
        sabores: ['🍍🥥 Pineapple Coconut', '🔵 Blue Razz', '🍓🍌 Strawberry Banana']
      },
      {
        id: 8,
        nombre: 'Sweet Delight',
        precio: 85000,
        precioEur: 15,
        stock: 2,
        tipo: '85k',
        color: 'linear-gradient(135deg, #f472b6, #ec4899)',
        emoji: '🟣',
        imagen: 'assets/85BangKing.jpg',
        sabores: ['🍩 Strawberry Donut', '💖 Love66', '🍌 Banana Ice']
      },
      {
        id: 9,
        nombre: 'Double Pineapple',
        precio: 85000,
        precioEur: 15,
        stock: 1,
        tipo: '85k',
        color: 'linear-gradient(135deg, #facc15, #eab308)',
        emoji: '🟣',
        imagen: 'assets/85BangKing.jpg',
        sabores: ['🍎 Double Apple', '🍍 Pineapple Ice', '🍓 Fruity Pfusion']
      },
      {
        id: 10,
        nombre: 'Berry Citrus',
        precio: 85000,
        precioEur: 15,
        stock: 1,
        tipo: '85k',
        color: 'linear-gradient(135deg, #60a5fa, #2563eb)',
        emoji: '🟣',
        imagen: 'assets/85BangKing.jpg',
        sabores: ['🫐 Blueberry Ice', '🍋 Lemon Lime', '🍓 Strawberry Watermelon']
      },
      {
        id: 11,
        nombre: 'Tropical Cherry',
        precio: 85000,
        precioEur: 15,
        stock: 1,
        tipo: '85k',
        color: 'linear-gradient(135deg, #fb7185, #dc2626)',
        emoji: '🟣',
        imagen: 'assets/85BangKing.jpg',
        sabores: ['🍑 Peach Mango', '🔵 Blue Razz Cherry', '❄️ Cool Mint']
      },
      // 80K - 12€
      {
        id: 20,
        nombre: 'Watermelon Bubble Gum',
        precio: 80000,
        precioEur: 12,
        stock: 3,
        tipo: '80k-RUNCHUNFU',
        color: 'linear-gradient(135deg, #f472b6, #ec4899)',
        emoji: '🍉',
        imagen: 'assets/Vaper80K.jpg',
        sabores: ['🍉 Watermelon', '🍬 Bubble Gum']
      },
      {
        id: 21,
        nombre: 'Blueberry Ice',
        precio: 80000,
        precioEur: 12,
        stock: 2,
        tipo: '80k-RUNCHUNFU',
        color: 'linear-gradient(135deg, #60a5fa, #2563eb)',
        emoji: '🫐',
        imagen: 'assets/Vaper80K.jpg',
        sabores: ['🫐 Blueberry', '❄️ Ice']
      },
      {
        id: 22,
        nombre: 'Mixed Berries',
        precio: 80000,
        precioEur: 12,
        stock: 3,
        tipo: '80k-RUNCHUNFU',
        color: 'linear-gradient(135deg, #f87171, #b91c1c)',
        emoji: '🍓',
        imagen: 'assets/Vaper80K.jpg',
        sabores: ['🍓 Strawberry', '🫐 Blueberry', '🍇 Grape']
      },
      {
        id: 23,
        nombre: 'Strawberry Watermelon',
        precio: 80000,
        precioEur: 12,
        stock: 3,
        tipo: '80k-12',
        color: 'linear-gradient(135deg, #fb7185, #f43f5e)',
        emoji: '🍓',
        imagen: 'assets/Vaper80K.jpg',
        sabores: ['🍓 Strawberry', '🍉 Watermelon']
      },

    ];
  }

  get vapersFiltrados(): Vaper[] {
    if (this.filtroActivo === 'all') return this.vapers;
    return this.vapers.filter(v => v.tipo === this.filtroActivo);
  }

  get totalStock(): number {
    return this.vapers.reduce((sum, vaper) => sum + vaper.stock, 0);
  }

  toggleSabores(id: number): void {
    this.saboresAbiertos[id] = !this.saboresAbiertos[id];
  }

  getStockPercent(stock: number): number {
    return Math.min((stock / 5) * 100, 100);
  }
}