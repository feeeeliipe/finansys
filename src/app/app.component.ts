import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  showNavbar = false;

  constructor(private router: Router) {
      this.router.events.subscribe((event) => {
        if(event instanceof NavigationEnd) {
          if(event.url.indexOf('/auth') == -1) {
            this.showNavbar = true;
          } else {
            this.showNavbar = false;
          }
        }
      });
  }
  
}
