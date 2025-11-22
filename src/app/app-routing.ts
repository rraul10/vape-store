import { Routes } from '@angular/router';
import { VaperListPublicComponent } from './components/vaper-list-public/vaper-list-public.component';
import { VaperListAdminComponent } from './components/vaper-list-admin/vaper-list-admin.component';

export const routes: Routes = [
  { path: '', component: VaperListPublicComponent },
  { path: 'admin', component: VaperListAdminComponent },
  { path: '**', redirectTo: '' }
];
