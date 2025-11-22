import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`
    nav { text-align:center; margin: 1rem; }
    a { margin: 0 1rem; text-decoration: none; color: #0d6efd; font-weight: bold; }
  `]
})
export class AppComponent {}
