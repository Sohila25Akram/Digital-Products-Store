import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  // isLoading = signal(false);

  errorMsg: string | null = null;

  form = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  })

   onSubmit(){
    if(!this.form.valid){
      return;
    }

    const email = this.form.value.email;
    const password = this.form.value.password;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log('login successed: ', res);
        this.router.navigate(['/'])
      },
      error: (err) => {
        console.log('error in login: ', err);
        this.errorMsg = 'Invalid Email or Password'
      }
    })
  }
}
