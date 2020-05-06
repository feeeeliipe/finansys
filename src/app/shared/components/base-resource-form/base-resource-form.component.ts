import { OnInit, AfterContentChecked, Injector} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from "toastr";

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(
      protected injector: Injector, 
      public resource: T, 
      protected resourceService: BaseResourceService<T>, 
      protected jsonDataToResourceFn: (jsonData) => T) { 

    this.route = injector.get(ActivatedRoute);
    this.router = injector.get(Router);
    this.formBuilder = injector.get(FormBuilder);
  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if(this.currentAction == "new") {
      this.createResource();
    } else {
      this.updateResource();
    }
  }

  // PRIVATE METHODS
  protected setCurrentAction() {
    this.route.snapshot.url[0].path == "new" ? this.currentAction = "new" : this.currentAction = "edit";
  }
  
  /*
  Gera uma restrição e obriga o componente que esta herdando
  a implementar o metodo buildResourceForm, garantindo que sempre
  existirá um formulário para o recurso
  */
  protected abstract buildResourceForm(): void;

  protected loadResource() {
    if(this.currentAction == "edit") {
      this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getById(+params.get("id")))
      ).subscribe(resource => {
        this.resource = resource;
        this.resourceForm.patchValue(this.resource);
      }, 
      error => {
        alert("Ocorreu um erro no servidor.");
      });
    }
  }

  protected setPageTitle() {
    if(this.currentAction == 'new') {
      this.pageTitle = this.creationPageTitle();
    } else {
      this.pageTitle = this.editionPageTitle();
    }
  }

  protected creationPageTitle(): string {
    return "Novo";
  }

  protected editionPageTitle(): string {
    return "Editando";
  }

  protected createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);   
    this.resourceService.create(resource).subscribe(
      resource => {
        this.actionsForSuccess(resource)
      },
      error => {
        this.actionsForError(error);
      }
    )
  }

  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    this.resourceService.update(resource).subscribe(
      resource => {
        this.actionsForSuccess(resource)
      },
      error => {
        this.actionsForError(error);
      }
    )
  }

  protected actionsForSuccess(resource: T) {
    toastr.success("Solicitação processada com sucesso!");
    
    // Recupera a rota pai do componente atual 
    const parentRoute = this.route.snapshot.parent.url[0].path;

    // REDIRECIONA O USUÁRIO PARA FORÇAR O RECARREGAMENTO DO COMPONENTE 
    // A propriedade "skipLocationChange" não adiciona o historico de navegação para essa rota.
    this.router.navigateByUrl(parentRoute, {skipLocationChange: true}).then(
      () => {
        this.router.navigate([parentRoute, resource.id, 'edit']);
      }
    );
  }

  protected actionsForError(error: any) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação!');
    this.submittingForm = false;
    if(error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor.'];
    }
  }

}
