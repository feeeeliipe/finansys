import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
    
    constructor(private http: HttpClient) { }
    
    login(loginInfo): Observable<any> {
        return this.http.post(`${environment.base_url}/auth/authenticate`, loginInfo);
    }
}