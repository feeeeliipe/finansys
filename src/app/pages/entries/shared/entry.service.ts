import { Injectable, Injector } from '@angular/core';
import { Entry } from './entry.model';
import { CategoryService } from './../../categories/shared/category.service'
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(protected injector: Injector, private categoryService: CategoryService) { 
    super('/entries', injector, Entry.fromJson);
  }

  getByMonthAndYear(month, year): Observable<Entry[]> {
    return this.getAll().pipe(
      map(entries => this.filterByMonthAndYear(entries, month, year))
    )
  }

  // privated methods 
  private filterByMonthAndYear(entries: Entry[], month: number, year: number): Array<Entry> {
    return entries.filter(entry => {
      const entryDate = moment(entry.date, 'DD/MM/YYYY');
      if((entryDate.month() + 1 == month) && (entryDate.year() == year)) {
        return entry;
      }
    })
  }
}
