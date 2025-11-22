import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VaperService, Vaper } from '../../services/vaper.service';

@Component({
  selector: 'app-vaper-list-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <div class="pattern-bg"></div>
      
      <div class="content">
        <!-- Header -->
        <div class="header">
          <h1>🔐 Panel de Admin</h1>
          <p>Gestiona tu inventario</p>
          <div class="stats">
            <div class="stat-badge">
              <span>📦 Total Stock:</span>
              <strong>{{ totalStock }}</strong>
            </div>
            <div class="stat-badge warning" *ngIf="stockBajo > 0">
              <span>⚠️ Stock bajo:</span>
              <strong>{{ stockBajo }}</strong>
            </div>
          </div>
        </div>

        <!-- Grid de Vapers -->
        <div class="vaper-grid">
          <div class="vaper-card" *ngFor="let vaper of vapers" [style.--color]="vaper.color">
            <div class="card-gradient"></div>
            
            <div class="card-image">
              <span class="emoji">{{ vaper.emoji }}</span>
              <div class="price-tag">{{ vaper.precioEur }}€</div>
            </div>

            <div class="card-content">
              <h3>{{ vaper.nombre }}</h3>
              
              <!-- Stock actual -->
              <div class="stock-display" [class.low]="vaper.stock <= 1" [class.medium]="vaper.stock === 2" [class.out]="vaper.stock === 0">
                <span class="stock-label">Stock:</span>
                <span class="stock-number">{{ vaper.stock }}</span>
                <span *ngIf="vaper.stock === 0" class="out-badge">AGOTADO</span>
                <span *ngIf="vaper.stock > 0 && vaper.stock <= 2" class="fire">🔥</span>
              </div>

              <!-- Controles de stock -->
              <div class="stock-controls">
                <button class="btn-control minus" (click)="updateStock(vaper, -1)" [disabled]="vaper.stock === 0">
                  <span>−</span>
                </button>
                <input 
                  type="number" 
                  [value]="vaper.stock" 
                  (change)="setStock(vaper, $event)"
                  min="0"
                  class="stock-input"
                >
                <button class="btn-control plus" (click)="updateStock(vaper, 1)">
                  <span>+</span>
                </button>
              </div>

              <!-- Botones rápidos -->
              <div class="quick-actions">
                <button class="btn-quick" (click)="updateStock(vaper, 5)">+5</button>
                <button class="btn-quick" (click)="updateStock(vaper, 10)">+10</button>
                <button class="btn-quick danger" (click)="setStockZero(vaper)">Agotar</button>
              </div>

              <!-- Sabores (colapsable) -->
              <button class="sabores-toggle" (click)="toggleSabores(vaper.id)">
                {{ saboresAbiertos[vaper.id] ? '▲ Ocultar' : '▼ Ver' }} sabores ({{ vaper.sabores.length }})
              </button>
              
              <div class="sabores-list" [class.open]="saboresAbiertos[vaper.id]">
                <div class="sabor-item" *ngFor="let sabor of vaper.sabores">
                  {{ sabor }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    
    .admin-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      position: relative;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }

    .pattern-bg {
      position: absolute;
      inset: 0;
      opacity: 0.3;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23f59e0b' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }

    .content {
      position: relative;
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .header { text-align: center; margin-bottom: 2rem; }

    .header h1 {
      font-size: 2.5rem;
      font-weight: 900;
      background: linear-gradient(90deg, #f59e0b, #ef4444);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.5rem 0;
    }

    .header p { color: #9ca3af; font-size: 1rem; margin: 0 0 1rem 0; }

    .stats { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }

    .stat-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      padding: 0.5rem 1rem;
      border-radius: 50px;
      color: #e5e7eb;
      font-size: 0.9rem;
    }

    .stat-badge strong { color: #4ade80; font-size: 1.1rem; }
    .stat-badge.warning strong { color: #fbbf24; }

    .vaper-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .vaper-card {
      --color: linear-gradient(135deg, #a855f7, #ec4899);
      position: relative;
      background: #1f2937;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .card-gradient { position: absolute; inset: 0; background: var(--color); opacity: 0.1; }

    .card-image {
      height: 120px;
      background: var(--color);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .emoji { font-size: 3.5rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3)); }

    .price-tag {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: rgba(0,0,0,0.5);
      padding: 0.25rem 0.6rem;
      border-radius: 50px;
      color: white;
      font-size: 0.85rem;
      font-weight: 700;
    }

    .card-content { padding: 1rem; position: relative; }
    .card-content h3 { color: white; font-weight: 700; font-size: 1rem; margin: 0 0 0.75rem 0; }

    .stock-display {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding: 0.5rem 0.75rem;
      background: rgba(74, 222, 128, 0.15);
      border-radius: 8px;
      border: 1px solid rgba(74, 222, 128, 0.3);
    }

    .stock-display.medium { background: rgba(251, 191, 36, 0.15); border-color: rgba(251, 191, 36, 0.3); }
    .stock-display.low, .stock-display.out { background: rgba(248, 113, 113, 0.15); border-color: rgba(248, 113, 113, 0.3); }

    .stock-label { color: #9ca3af; font-size: 0.85rem; }
    .stock-number { color: #4ade80; font-size: 1.5rem; font-weight: 800; }
    .stock-display.medium .stock-number { color: #fbbf24; }
    .stock-display.low .stock-number, .stock-display.out .stock-number { color: #f87171; }

    .out-badge {
      background: #ef4444;
      color: white;
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-weight: 700;
      margin-left: auto;
    }

    .fire { animation: pulse 1s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

    .stock-controls { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; }

    .btn-control {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 10px;
      font-size: 1.5rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-control.minus { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
    .btn-control.plus { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; }
    .btn-control:hover:not(:disabled) { transform: scale(1.1); }
    .btn-control:disabled { opacity: 0.4; cursor: not-allowed; }

    .stock-input {
      flex: 1;
      height: 40px;
      border: 2px solid rgba(255,255,255,0.2);
      border-radius: 10px;
      background: rgba(255,255,255,0.1);
      color: white;
      font-size: 1.2rem;
      font-weight: 700;
      text-align: center;
      outline: none;
    }

    .stock-input:focus { border-color: #a855f7; }
    .stock-input::-webkit-inner-spin-button { -webkit-appearance: none; }

    .quick-actions { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }

    .btn-quick {
      flex: 1;
      padding: 0.4rem;
      border: none;
      border-radius: 6px;
      background: rgba(255,255,255,0.15);
      color: #e5e7eb;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-quick:hover { background: rgba(255,255,255,0.25); }
    .btn-quick.danger { background: rgba(239, 68, 68, 0.3); color: #fca5a5; }
    .btn-quick.danger:hover { background: rgba(239, 68, 68, 0.5); }

    .sabores-toggle {
      width: 100%;
      padding: 0.5rem;
      border: none;
      border-radius: 6px;
      background: rgba(255,255,255,0.1);
      color: #9ca3af;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .sabores-toggle:hover { background: rgba(255,255,255,0.15); }

    .sabores-list { max-height: 0; overflow: hidden; transition: max-height 0.3s; }
    .sabores-list.open { max-height: 150px; margin-top: 0.5rem; }

    .sabor-item {
      color: #d1d5db;
      font-size: 0.8rem;
      padding: 0.3rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    @media (max-width: 640px) {
      .header h1 { font-size: 1.8rem; }
      .vaper-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class VaperListAdminComponent implements OnInit {
  vapers: Vaper[] = [];
  saboresAbiertos: { [key: number]: boolean } = {};

  constructor(private service: VaperService) {}

  ngOnInit(): void {
    this.vapers = this.service.getVapers();
  }

  get totalStock(): number {
    return this.vapers.reduce((sum, v) => sum + v.stock, 0);
  }

  get stockBajo(): number {
    return this.vapers.filter(v => v.stock > 0 && v.stock <= 2).length;
  }

  updateStock(vaper: Vaper, change: number): void {
    vaper.stock = Math.max(0, vaper.stock + change);
    this.service.updateStock(vaper.id, vaper.stock);
  }

  setStock(vaper: Vaper, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Math.max(0, parseInt(input.value) || 0);
    vaper.stock = value;
    this.service.updateStock(vaper.id, value);
  }

  setStockZero(vaper: Vaper): void {
    vaper.stock = 0;
    this.service.updateStock(vaper.id, 0);
  }

  toggleSabores(id: number): void {
    this.saboresAbiertos[id] = !this.saboresAbiertos[id];
  }
}