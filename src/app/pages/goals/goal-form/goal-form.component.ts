import { Component, Injector } from '@angular/core';
import { GoalService } from '../shared/goals.service';
import { Goal } from '../shared/goals.model';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-goal-form',
  templateUrl: './goal-form.component.html',
  styleUrls: ['./goal-form.component.css']
})
export class GoalFormComponent extends BaseResourceFormComponent<Goal> {

  constructor(protected goalService: GoalService, protected injector: Injector) { 
    super(injector, new Goal(), goalService, Goal.fromJson);
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      description: [null, Validators.required],
      initialDate: [null, Validators.required],
      endDate: [null, Validators.required],
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
}
