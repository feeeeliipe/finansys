import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
import toastr from 'toastr'
import { AuthenticationService } from 'src/app/pages/authentication/shared/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(this.authService.isTokenValid()) {
      return true
    } else {
      toastr.error('Acesso não permitido. Faça o login para acessar!');
      this.router.navigate(['auth/login']);
      return false;
    }
  }
}
