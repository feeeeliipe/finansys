import { Component, OnInit } from '@angular/core';
import { BaseResourceListComponent } from 'src/app/shared/components/base-resource-list/base-resource-list.component';
import { Goal } from '../shared/goals.model';
import { GoalService } from "../shared/goals.service";

@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.css']
})
export class GoalListComponent extends BaseResourceListComponent<Goal> {

  constructor(protected categoryService: GoalService) { 
    super(categoryService);
  }

}
