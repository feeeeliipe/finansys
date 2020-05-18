import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../shared/authentication.service';
import { Router } from '@angular/router';
import toastr from 'toastr'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private authtenticationService: AuthenticationService, 
    private router: Router) { }

  ngOnInit(): void {
    const token = this.authtenticationService.getToken();
    if(token) {
      this.router.navigate(['/reports']);  
    }

    this.loginForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    });

  }

  login() {
    this.authtenticationService.login(this.loginForm.value).subscribe(user => {
      localStorage.clear();
      localStorage.setItem('fortune-token', user.token)
      this.router.navigate(['/categories']);
    },
    errorResponse => {
      toastr.error(errorResponse.error.error)
    });
  }

}
