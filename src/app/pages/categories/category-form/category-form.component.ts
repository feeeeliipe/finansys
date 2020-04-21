import { Component, OnInit, AfterContentChecked} from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, toArray } from 'rxjs/operators';
import toastr from "toastr";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(private categoryService: CategoryService, 
              private route: ActivatedRoute, 
              private router: Router, 
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if(this.currentAction == "new") {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  // PRIVATE METHODS
  private setCurrentAction() {
    this.route.snapshot.url[0].path == "new" ? this.currentAction = "new" : this.currentAction = "edit";
  }
  
  private buildCategoryForm() {
    this.categoryForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory() {
    if(this.currentAction == "edit") {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get("id")))
      ).subscribe(category => {
        this.category = category;
        this.categoryForm.patchValue(this.category);
      }, 
      error => {
        alert("Ocorreu um erro no servidor.");
      });
    }
  }

  private setPageTitle() {
    if(this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de nova categoria'
    } else {
      const categoryName = this.category.name || "";
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }

  private createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category).subscribe(
      category => {
        this.actionsForSuccess(category)
      },
      error => {
        this.actionsForError(error);
      }
    )
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category).subscribe(
      category => {
        this.actionsForSuccess(category)
      },
      error => {
        this.actionsForError(error);
      }
    )
  }

  private actionsForSuccess(category: Category) {
    toastr.success("Categoria criada com sucesso!");
    
    // REDIRECIONA O USUÁRIO PARA FORÇAR O RECARREGAMENTO DO COMPONENTE 
    // A propriedade "skipLocationChange" não adiciona o historico de navegação para essa rota.
    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => {
        this.router.navigate(['categories', category.id, 'edit']);
      }
    );
  }

  private actionsForError(error: any) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação!');
    this.submittingForm = false;
    if(error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor.'];
    }
  }

}
