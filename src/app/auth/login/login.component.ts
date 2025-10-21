import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { LoaderDirective } from '../../shared/loader.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LoaderDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMsg: string | null = null;

  form = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  })

   onSubmit(){
    if(!this.form.valid){
      return;
    }
    this.isLoading.set(true);

    const email = this.form.value.email;
    const password = this.form.value.password;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log('login successed: ', res);
         setTimeout(() => {
          this.isLoading.set(false);
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (err) => {
        console.log('error in login: ', err);
        setTimeout(() => {
          this.isLoading.set(false);
          this.errorMsg = 'Invalid Email or Password';
        }, 3000);
      }
    })
  }
}
