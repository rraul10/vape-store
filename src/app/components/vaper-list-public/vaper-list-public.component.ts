import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VaperService, Vaper } from '../../services/vaper.service';

@Component({
  selector: 'app-vaper-list-public',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="catalog-container">
      <div class="pattern-bg"></div>
      
      <div class="content">
        <!-- Header -->
        <div class="header">
          <h1>🌬️ Vaper Stock</h1>
          <p>Encuentra tu sabor favorito</p>
          <div class="stock-badge">
            <span class="stock-icon">📦</span>
            <span>{{ totalStock }} productos en stock</span>
          </div>
        </div>

        <!-- Filtros -->
        <div class="filters">
          <button 
            *ngFor="let f of filtros" 
            [class.active]="filtroActivo === f.value"
            (click)="filtroActivo = f.value">
            {{ f.label }}
          </button>
        </div>

        <!-- Grid de Vapers -->
        <div class="vaper-grid">
          <div class="vaper-card" *ngFor="let vaper of vapersFiltrados" [style.--color]="vaper.color">
            <div class="card-gradient"></div>
            
            <div class="card-image">
              <div class="image-overlay"></div>
              <span class="emoji">{{ vaper.emoji }}</span>
              <div class="price-tag">{{ vaper.precioEur }}€</div>
            </div>

            <div class="card-content">
              <h3>{{ vaper.nombre }}</h3>
              
              <div class="stock-info" [class.low]="vaper.stock <= 1" [class.medium]="vaper.stock === 2">
                <span class="package-icon">📦</span>
                <span>{{ vaper.stock }} {{ vaper.stock === 1 ? 'unidad disponible' : 'unidades disponibles' }}</span>
                <span *ngIf="vaper.stock <= 2" class="fire">🔥</span>
              </div>

              <button class="sabores-btn" (click)="toggleSabores(vaper.id)">
                <span>Ver sabores ({{ vaper.sabores.length }})</span>
                <span class="chevron">{{ saboresAbiertos[vaper.id] ? '▲' : '▼' }}</span>
              </button>

              <div class="sabores-list" [class.open]="saboresAbiertos[vaper.id]">
                <div class="sabores-container">
                  <div class="sabor-item" *ngFor="let sabor of vaper.sabores">
                    <span class="dot"></span>
                    {{ sabor }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>📱 Consulta disponibilidad • 🚚 Envíos a todo el país</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    
    .catalog-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
      position: relative;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }

    .pattern-bg {
      position: absolute;
      inset: 0;
      opacity: 0.5;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }

    .content {
      position: relative;
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .header h1 {
      font-size: 3rem;
      font-weight: 900;
      background: linear-gradient(90deg, #a855f7, #ec4899, #ef4444);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.5rem 0;
    }

    .header p {
      color: #9ca3af;
      font-size: 1.1rem;
      margin: 0 0 1rem 0;
    }

    .stock-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      padding: 0.5rem 1rem;
      border-radius: 50px;
      color: white;
      font-weight: 500;
    }

    .filters {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filters button {
      padding: 0.6rem 1.5rem;
      border-radius: 50px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      background: rgba(255,255,255,0.1);
      color: #d1d5db;
    }

    .filters button:hover {
      background: rgba(255,255,255,0.2);
    }

    .filters button.active {
      background: linear-gradient(90deg, #a855f7, #ec4899);
      color: white;
      box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
    }

    .vaper-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .vaper-card {
      --color: linear-gradient(135deg, #a855f7, #ec4899);
      position: relative;
      background: #1f2937;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      transition: all 0.3s;
    }

    .vaper-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 50px rgba(0,0,0,0.4);
    }

    .card-gradient {
      position: absolute;
      inset: 0;
      background: var(--color);
      opacity: 0.15;
      transition: opacity 0.3s;
    }

    .vaper-card:hover .card-gradient {
      opacity: 0.25;
    }

    .card-image {
      height: 160px;
      background: var(--color);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .image-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.1);
    }

    .emoji {
      font-size: 4.5rem;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
      transition: transform 0.3s;
      position: relative;
      z-index: 1;
    }

    .vaper-card:hover .emoji {
      transform: scale(1.15);
    }

    .price-tag {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(10px);
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      color: white;
      font-size: 0.9rem;
      font-weight: 700;
    }

    .card-content {
      padding: 1.25rem;
      position: relative;
    }

    .card-content h3 {
      color: white;
      font-weight: 700;
      font-size: 1.1rem;
      margin: 0 0 0.75rem 0;
      transition: all 0.3s;
    }

    .vaper-card:hover .card-content h3 {
      background: linear-gradient(90deg, white, #d1d5db);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stock-info {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      color: #4ade80;
      margin-bottom: 1rem;
    }

    .stock-info.medium { color: #facc15; }
    .stock-info.low { color: #f87171; }

    .fire {
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .sabores-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      border: none;
      background: var(--color);
      color: white;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }

    .sabores-btn:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }

    .sabores-list {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
    }

    .sabores-list.open {
      max-height: 200px;
    }

    .sabores-container {
      background: rgba(31, 41, 55, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 0.75rem;
      padding: 0.75rem;
      margin-top: 0.75rem;
    }

    .sabor-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #e5e7eb;
      font-size: 0.9rem;
      padding: 0.4rem 0.5rem;
      border-radius: 0.5rem;
      transition: background 0.2s;
    }

    .sabor-item:hover {
      background: rgba(255,255,255,0.1);
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: linear-gradient(90deg, white, #9ca3af);
    }

    .footer {
      margin-top: 3rem;
      text-align: center;
      color: #6b7280;
      font-size: 0.9rem;
    }

    @media (max-width: 640px) {
      .header h1 { font-size: 2rem; }
      .vaper-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class VaperListPublicComponent implements OnInit {
  filtroActivo = 'all';
  saboresAbiertos: { [key: number]: boolean } = {};
  vapers: Vaper[] = [];

  filtros = [
    { label: '🔥 Todos', value: 'all' },
    { label: '💚 14€', value: '80000' },
    { label: '💜 15€', value: '85000' }
  ];

  constructor(private service: VaperService) {}

  ngOnInit(): void {
    this.vapers = this.service.getVapersDisponibles();
  }

  get vapersFiltrados(): Vaper[] {
    if (this.filtroActivo === 'all') return this.vapers;
    return this.vapers.filter(v => v.precio === parseInt(this.filtroActivo));
  }

  get totalStock(): number {
    return this.service.getTotalStock();
  }

  toggleSabores(id: number): void {
    this.saboresAbiertos[id] = !this.saboresAbiertos[id];
  }
}