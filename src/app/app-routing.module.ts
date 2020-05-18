import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './shared/services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth',       loadChildren: () => import('./pages/authentication/authentication.module').then(mod => mod.AuthenticationModule) },
  { path: 'categories', canActivate: [AuthGuardService], loadChildren: () => import('./pages/categories/categories.module').then(mod => mod.CategoriesModule) },
  { path: 'entries',    canActivate: [AuthGuardService], loadChildren: () => import('./pages/entries/entries.module').then(mod => mod.EntriesModule) },
  { path: 'reports',    canActivate: [AuthGuardService], loadChildren: () => import('./pages/reports/reports.module').then(mod => mod.ReportsModule) },
  { path: 'goals',      canActivate: [AuthGuardService], loadChildren: () => import('./pages/goals/goals.module').then(mod => mod.GoalsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
