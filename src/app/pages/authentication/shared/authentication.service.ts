import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, ObservedValueOf } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'

@Injectable({providedIn: 'root'})
export class AuthenticationService {
    
    constructor(private http: HttpClient) { }
    
    register(user): Observable<any> {
      return this.http.post(`${environment.base_url}/auth/register`, user);
    }

    login(loginInfo): Observable<any> {
        return this.http.post(`${environment.base_url}/auth/authenticate`, loginInfo);
    }

    getToken(): string {
        return localStorage.getItem('fortune-token');
    }

    isTokenValid(): boolean {
        const token = localStorage.getItem('fortune-token');
        if(!token) {
          return false;
        }
        const jwt = new JwtHelperService();
        if(jwt.isTokenExpired(token))
        {
          return false;  
        } 
        return true;
      }
}