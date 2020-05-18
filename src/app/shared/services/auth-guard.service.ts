import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import jwt from 'jsonwebtoken'
import { environment } from 'src/environments/environment';
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

    jwt.verify(token, environment.jwt_secret, (err, decoded) => {
      if(err) {
          return false;
      }
    });

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
