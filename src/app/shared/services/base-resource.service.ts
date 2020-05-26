import { BaseResourceModel } from '../models/base-resource.model';

import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, flatMap } from 'rxjs/operators';
import { Injector } from '@angular/core';
import { environment } from 'src/environments/environment';

export abstract class BaseResourceService<T extends BaseResourceModel> {
    
    protected http: HttpClient;

    constructor(
      protected apiPath: string, 
      protected injector: Injector, 
      protected jsonDataToResourceFn: (jsonData) => T) {
     
      /* 
      Recebe na função jsonDataToResourceFn um metodo especifico de cada recurso 
      indicando como obter um objeto instanciado do recurso através de um json 
      Ex: Para um serviço de categoria será informado um metodo que instancia 
      uma nova categoria através do json recebido
      */

      /*
      Usa o injector para não precisar passar todas as vezes o objeto de HttpClient instanciado
      Se já existir uma instância do HttpClient o angular vai usar a mesma
      */
      this.http = injector.get(HttpClient);
    
    }

    getAll(): Observable<T[]> {
        return this.http.get(`${environment.base_url}${this.apiPath}`).pipe(
          /*
          O .bind(this) garante que o contexto dentro da função "jsonDataToResources"
          será o contexto do serviço atual (BaseResourceService) e não do Map. 

          Dentro da função jsonDataToResources é executado um metodo que existe
          somente dentro do BaseResourceService (jsonDataToResourceFn), sendo assim, 
          se o contexto for alterado a função não existirá e um erro será causado. 
          */
          map(this.jsonDataToResources.bind(this)),
          catchError(this.handleError)
        )
    }
    
    getById(id: string): Observable<T> {
        const url = `${environment.base_url}${this.apiPath}/${id}`;
        return this.http.get(url).pipe(
          map(this.jsonDataToResource.bind(this)),
          catchError(this.handleError)
        )
    }
    
    create(resource: T): Observable<T> {
        return this.http.post(`${environment.base_url}${this.apiPath}`, resource).pipe(
          map(this.jsonDataToResource.bind(this)),
          catchError(this.handleError)
        )
    }
    
    update(resource: T): Observable<T> {
        return this.http.put(`${environment.base_url}${this.apiPath}/${resource._id}`, resource).pipe(
          map(() => resource),
          catchError(this.handleError)
        );
    }
    
    delete(id: string): Observable<any> {
        return this.http.delete(`${environment.base_url}${this.apiPath}/${id}`).pipe(
          map(() => null),
          catchError(this.handleError)
        )
    }

    // PROTECTED METHODS
    protected jsonDataToResources(jsonData: any[]): T[] {
        const resources: T[] = [];        
        jsonData.forEach(
          element => resources.push(this.jsonDataToResourceFn(element))
        );
        return resources;
    }

    protected jsonDataToResource(jsonData: any): T {
        return this.jsonDataToResourceFn(jsonData);
    }

    protected handleError(error: any): Observable<any> {
        console.log("Erro na requisição: " + error);
        return throwError(error);
    }
}