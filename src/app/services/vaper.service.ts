import { Injectable } from '@angular/core';

export interface Vaper {
  id: number;
  nombre: string;
  precio: number;
  precioEur: number;
  stock: number;
  sabores: string[];
  color: string;
  emoji: string;
}

@Injectable({ providedIn: 'root' })
export class VaperService {
  private vapers: Vaper[] = [
    // VAPERS 80K - 14€
    { id: 1, nombre: "Pack 80K - Frutales Fresh", precio: 80000, precioEur: 14, stock: 2, sabores: ["🍉❄️ Watermelon Ice", "🍓🍦 Strawberry Ice Cream", "🍈🍈 Triple Melon"], color: "linear-gradient(135deg, #4ade80, #06b6d4)", emoji: "🍉" },
    { id: 2, nombre: "Pack 80K - Tropical Mix", precio: 80000, precioEur: 14, stock: 5, sabores: ["🍍 Tropical Fruit", "🍓🍉 Strawberry Watermelon", "🍓🥭 Strawberry Mango"], color: "linear-gradient(135deg, #fb923c, #ec4899)", emoji: "🍍" },
    { id: 3, nombre: "Pack 80K - Berry Fusion", precio: 80000, precioEur: 14, stock: 2, sabores: ["🥝 Kiwi Passion Fruit", "🍓🍌 Strawberry Banana", "🔵 Blue Razz"], color: "linear-gradient(135deg, #60a5fa, #a855f7)", emoji: "🫐" },
    { id: 4, nombre: "Pack 80K - Citrus Splash", precio: 80000, precioEur: 14, stock: 1, sabores: ["🍓🍌 Strawberry Banana", "🍉 Raspberry Watermelon", "🍋 Lemon Lime"], color: "linear-gradient(135deg, #facc15, #84cc16)", emoji: "🍋" },
    // VAPERS 85K - 15€
    { id: 5, nombre: "Pack 85K - Sweet Treats", precio: 85000, precioEur: 15, stock: 2, sabores: ["🍓🍩 Strawberry Donut", "💗 Love 66", "🍌❄️ Banana Ice"], color: "linear-gradient(135deg, #f472b6, #e11d48)", emoji: "🍩" },
    { id: 6, nombre: "Pack 85K - Cool Vibes", precio: 85000, precioEur: 15, stock: 2, sabores: ["🍑🥭 Peach Mango", "🫐🍒 Blue Razz Cherry", "❄️🌿 Cool Mint"], color: "linear-gradient(135deg, #2dd4bf, #10b981)", emoji: "🍃" },
    { id: 7, nombre: "Pack 85K - Blue Edition", precio: 85000, precioEur: 15, stock: 1, sabores: ["🫐❄️ Blueberry Ice", "🍋🍈 Lemon Lime", "🍓🍉 Strawberry Watermelon"], color: "linear-gradient(135deg, #818cf8, #2563eb)", emoji: "💎" },
    { id: 8, nombre: "Pack 85K - Fruity Delight", precio: 85000, precioEur: 15, stock: 1, sabores: ["🍏🍎 Double Apple", "🍍❄️ Pineapple Ice", "🍇🍉🍓 Fruity Fusion"], color: "linear-gradient(135deg, #f87171, #22c55e)", emoji: "🍎" },
    { id: 9, nombre: "Pack 85K - Grape Paradise", precio: 85000, precioEur: 15, stock: 4, sabores: ["🟣 Grape Ice", "🍓🥝 Strawberry Kiwi", "🟠 Passion Fruit Guava"], color: "linear-gradient(135deg, #a855f7, #7c3aed)", emoji: "🍇" },
    { id: 10, nombre: "Pack 85K - Energy Boost", precio: 85000, precioEur: 15, stock: 2, sabores: ["🔵 Red Bull", "🫐🍉 Blueberry Watermelon", "🍓🍦 Strawberry Ice Cream"], color: "linear-gradient(135deg, #38bdf8, #2563eb)", emoji: "⚡" },
    { id: 11, nombre: "Pack 85K - Love Edition", precio: 85000, precioEur: 15, stock: 2, sabores: ["💙 Love 666", "🔵 Blueberry Raspberry", "💜 Vimto"], color: "linear-gradient(135deg, #e879f9, #9333ea)", emoji: "💜" },
    { id: 12, nombre: "Pack 85K - Berry Dark", precio: 85000, precioEur: 15, stock: 3, sabores: ["🍓🔵 Strawberry Raspberry", "⚫ Black Currant", "🍓🍌 Strawberry Banana"], color: "linear-gradient(135deg, #475569, #1f2937)", emoji: "🖤" },
    { id: 13, nombre: "Pack 85K - Mixed Special", precio: 85000, precioEur: 15, stock: 1, sabores: ["🍍❄️ Pineapple Ice", "🍓⚡ Strawberry Red Bull", "🫐 Mixed Berries"], color: "linear-gradient(135deg, #fbbf24, #ea580c)", emoji: "✨" }
  ];

  getVapers(): Vaper[] {
    return this.vapers;
  }

  getVapersDisponibles(): Vaper[] {
    return this.vapers.filter(v => v.stock > 0);
  }

  getTotalStock(): number {
    return this.vapers.reduce((sum, v) => sum + v.stock, 0);
  }

  updateStock(id: number, nuevoStock: number): void {
    const v = this.vapers.find(vaper => vaper.id === id);
    if (v) v.stock = Math.max(0, nuevoStock);
  }
}