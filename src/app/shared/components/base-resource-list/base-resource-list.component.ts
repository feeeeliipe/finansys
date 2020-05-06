import { OnInit } from '@angular/core';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];

  constructor(protected resourceService: BaseResourceService<T>) { }

  ngOnInit(): void {
    this.resourceService.getAll().subscribe(
      resources => {
      this.resources = resources;
    },
    error => alert('Erro ao carregar a lista'))
  }

  deleteResource(resource: T) {
    const mustDelete = confirm(this.deleteConfirmationMessage());
    
    if(mustDelete) {
      this.resourceService.delete(resource.id).subscribe(
        () => { 
          this.resources = this.resources.filter(element => element != resource);
        }, 
        error => {
          alert('Erro ao excluir registro')
      })
    }
  }

  protected deleteConfirmationMessage(): string {
      return "Deseja realmente excluir o registro ?";
  }
}