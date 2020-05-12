import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoalListComponent } from './goal-list/goal-list.component';
import { GoalFormComponent } from './goal-form/goal-form.component';

const routes: Routes = [
  { path: '', component: GoalListComponent }, 
  { path: 'new', component: GoalFormComponent },
  { path: ':id/edit', component: GoalFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoalsRoutingModule { }
