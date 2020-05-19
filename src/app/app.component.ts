import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  showNavbar = false;

  private isRouteFromAuthModule(router): boolean {
    return (router.url.indexOf('/auth') == -1) && (router.urlAfterRedirects.indexOf('/auth') == -1)
  }

  constructor(private router: Router) {
      this.router.events.subscribe((router) => {
        if(router instanceof NavigationEnd) {
          this.showNavbar = this.isRouteFromAuthModule(router);
        }
      });
  }
}


