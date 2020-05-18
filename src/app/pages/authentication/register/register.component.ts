import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../shared/authentication.service';
import toastr from 'toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  register() {
    this.authService.register(this.registerForm.value).subscribe(user => {
      toastr.success('Usuário criado com sucesso!');
      this.router.navigate(['/auth/login']);  
    },
    errorresponse => {
      if(errorresponse.status == 400) {
        toastr.error(errorresponse.error.error);
      } else {
        toastr.error('Infelizmente ocorreu um erro ao criar seu usuário. Tente novamente mais tarde!');
      }
    });
  }

}
