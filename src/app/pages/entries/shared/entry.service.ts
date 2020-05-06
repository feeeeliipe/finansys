import { Injectable, Injector } from '@angular/core';
import { Entry } from './entry.model';
import { CategoryService } from './../../categories/shared/category.service'
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(protected injector: Injector, private categoryService: CategoryService) { 
    super('api/entries', injector);
  }

  create(entry: Entry): Observable<Entry> {
    // FAZ O RELACIONAMENTO FORÇADO DO LANÇAMENTO COM A CATEGORIA
    // IMPLEMENTAÇÃO REALIZADA APENAS PORQUE ESTAMOS UTILIZANDO UM BACKEND MOCK
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;

        // Chama o metodo create da clase base
        return super.create(entry);
      })
    )
  }

  update(entry: Entry): Observable<Entry> {
    // FAZ O RELACIONAMENTO FORÇADO DO LANÇAMENTO COM A CATEGORIA
    // IMPLEMENTAÇÃO REALIZADA APENAS PORQUE ESTAMOS UTILIZANDO UM BACKEND MOCK
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.update(entry);
      })
    )
    
  }

  // PROTECTED METHODS
  protected jsonDataToResources(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach(element => entries.push(Object.assign(new Entry(), element)));
    return entries;
  }

  protected jsonDataToResource(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

}
