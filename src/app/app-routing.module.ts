import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/reports', pathMatch: 'full' },
  { path: 'categories', loadChildren: () => import('./pages/categories/categories.module').then(mod => mod.CategoriesModule) },
  { path: 'entries',    loadChildren: () => import('./pages/entries/entries.module').then(mod => mod.EntriesModule) },
  { path: 'reports',    loadChildren: () => import('./pages/reports/reports.module').then(mod => mod.ReportsModule) },
  { path: 'goals',      loadChildren: () => import('./pages/goals/goals.module').then(mod => mod.GoalsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
