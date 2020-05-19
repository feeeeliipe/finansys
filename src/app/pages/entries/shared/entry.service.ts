import { Injectable, Injector } from '@angular/core';
import { Entry } from './entry.model';
import { CategoryService } from './../../categories/shared/category.service'
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(protected injector: Injector, private categoryService: CategoryService) { 
    super('/entries', injector, Entry.fromJson);
  }

  getByPeriod(firstDate, finalDate): Observable<Entry[]> {
    // Formata as datas 
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' }) 
    let [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat .formatToParts(firstDate);
    firstDate = `${year}-${month}-${day}`;
    [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat .formatToParts(finalDate);
    finalDate = `${year}-${month}-${day}`;
    // Faz a chamada filtrando por data de vencimento 
    return this.http.get<Entry[]>(`${environment.base_url}${this.apiPath}?dueDate=${firstDate},${finalDate}`);
  }
  
}
