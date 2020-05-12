import { NgModule } from '@angular/core';
import { GoalsRoutingModule } from './goals-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoalListComponent } from './goal-list/goal-list.component';
import { GoalFormComponent } from './goal-form/goal-form.component';



@NgModule({
  declarations: [GoalListComponent, GoalFormComponent],
  imports: [
    SharedModule,
    GoalsRoutingModule
  ]
})
export class GoalsModule { }
