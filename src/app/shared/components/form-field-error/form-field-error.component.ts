import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{errorMessage}}
    </p>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {

  /*
  O nome externo da propriedade será 'form-control', mas
  internamente trabalharemos com a variável formControl.

  Exemplo de chamada do componente:
  <app-form-field-error [form-control]="meuFormControl"></app-form-field-error>
  */
  @Input('form-control') formControl: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

  public get errorMessage(): string | null {
    if (this.mustShowErrorMessage()) {
      return this.getErrorMessage();
    } else {
      return null
    }
  }

  private mustShowErrorMessage(): boolean {
    return this.formControl.invalid && this.formControl.touched;
  }

  private getErrorMessage(): string | null {
    if(this.formControl.errors.required) {
      return 'Informação obrigatório';
    } else if (this.formControl.errors.minlength) {
      const requiredLength = this.formControl.errors.minlength.requiredLength;
      return `Informe no mínimo ${requiredLength} caracteres`; 
    } else if(this.formControl.errors.maxlength) {
      const requiredLength = this.formControl.errors.maxlength.requiredLength;
      return `Informe no máximo ${requiredLength} caracteres`; 
    } else if(this.formControl.errors.email) {
      return 'Formato de e-mail inválido'
    }
  }

}
