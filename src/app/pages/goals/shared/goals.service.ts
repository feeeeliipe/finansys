import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { Goal } from './goals.model';

@Injectable({
  providedIn: 'root'
})
export class GoalService extends BaseResourceService<Goal> {

  constructor(protected injector: Injector) { 
    super('api/goals', injector, Goal.fromJson);
  }

}