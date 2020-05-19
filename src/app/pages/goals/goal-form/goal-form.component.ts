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

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  }

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
}
