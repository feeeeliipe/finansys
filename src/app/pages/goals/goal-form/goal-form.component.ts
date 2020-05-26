import { Component, Injector } from '@angular/core';
import { GoalService } from '../shared/goals.service';
import { Goal } from '../shared/goals.model';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';
import { Validators } from '@angular/forms';
import { generalConfig } from '../../../shared/config/general.configs'

@Component({
  selector: 'app-goal-form',
  templateUrl: './goal-form.component.html',
  styleUrls: ['./goal-form.component.css']
})
export class GoalFormComponent extends BaseResourceFormComponent<Goal> {

  ptBR = generalConfig.ptBR;
  imaskConfig = generalConfig.imaskConfig;

  constructor(protected goalService: GoalService, protected injector: Injector) { 
    super(injector, new Goal(), goalService, Goal.fromJson);
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      _id: [null],
      description: [null, Validators.required],
      initialDate: [null, Validators.required],
      finalDate: [null, Validators.required],
      expectedAmount: [null, Validators.required],
      installmentsQuantity: [null],
      installmentsValue: [null]
    });
  }

  protected creationPageTitle(): string {
    return "Nova Meta";
  }

  protected editionPageTitle(): string {
    let title = this.resource.description || '';
    title = "Editando a meta: " + title;
    return title;
  }

  protected prepareFormValues(resource): Goal {
    resource.expectedAmount = resource.expectedAmount + '';
    resource.initialDate = new Date(resource.initialDate);
    resource.finalDate = new Date(resource.finalDate);
    return resource;
  }

  protected prepareValuesToServer(goal): Goal {
    let expectedAmount = goal.expectedAmount;
    expectedAmount = expectedAmount.replace(",", ".");
    goal.expectedAmount = expectedAmount;
    return goal;
  }
  
}
