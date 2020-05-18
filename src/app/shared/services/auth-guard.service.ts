import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
import toastr from 'toastr'

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) { }

  isLogged(): boolean {
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

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(this.isLogged()) {
      return true
    } else {
      toastr.error('Acesso não permitido. Faça o login para acessar!');
      this.router.navigate(['auth/login']);
      return false;
    }
  }
}
