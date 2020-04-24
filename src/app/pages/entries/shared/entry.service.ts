import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, flatMap } from 'rxjs/operators';
import { Entry } from './entry.model';
import { CategoryService } from './../../categories/shared/category.service'

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = 'api/entries';

  constructor(private http: HttpClient,
              private categoryService: CategoryService) {  }

  getAll(): Observable<Entry[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)
    )
  }

  getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    )
  }

  create(entry: Entry): Observable<Entry> {
    // FAZ O RELACIONAMENTO FORÇADO DO LANÇAMENTO COM A CATEGORIA
    // IMPLEMENTAÇÃO REALIZADA APENAS PORQUE ESTAMOS UTILIZANDO UM BACKEND MOCK
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;

        return this.http.post(this.apiPath, entry).pipe(
          catchError(this.handleError),
          map(this.jsonDataToEntry)
        )

      })
    )
  }

  update(entry: Entry): Observable<Entry> {
    // FAZ O RELACIONAMENTO FORÇADO DO LANÇAMENTO COM A CATEGORIA
    // IMPLEMENTAÇÃO REALIZADA APENAS PORQUE ESTAMOS UTILIZANDO UM BACKEND MOCK
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;

        return this.http.put(`${this.apiPath}/${entry.id}`, entry).pipe(
          catchError(this.handleError),
          map(() => entry)
        );
        
      })
    )
    
    
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiPath}/${id}`).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  // PRIVATE METHODS
  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach(element => entries.push(Object.assign(new Entry(), element)));
    return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

  private handleError(error: any): Observable<any> {
    console.log("Erro na requisição: " + error);
    return throwError(error);
  }
}
