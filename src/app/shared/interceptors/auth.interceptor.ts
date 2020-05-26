import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/pages/authentication/shared/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
    constructor(private authService: AuthenticationService) {}

    isAuthRequest(req: HttpRequest<any>): boolean {
        const indexAuth = req.url.indexOf('/auth/');
        return !(indexAuth != -1)
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');    

        if(this.isAuthRequest(req)) {
            const token = this.authService.getToken();
            headers = headers.append('Authorization', `Bearer ${token}`);
        }
        
        const authReq = req.clone({ headers });
        return next.handle(authReq);
    }
}