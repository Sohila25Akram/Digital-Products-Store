import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { LoaderDirective } from '../../shared/loader.directive';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, LoaderDirective],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', Validators['required']),
    password: new FormControl('', Validators['required'])
  })

  isLoading = signal(false);
  errorMsg: string | null = null;

  onSubmit(){
    if(!this.form.valid){
      return;
    }
    this.isLoading.set(true);

    const email = this.form.value.email!;
    const password = this.form.value.password!;

    this.authService.signup(email, password).subscribe({
      next: (res) => {
        console.log('sigiup completed');
        setTimeout(() => {
          this.isLoading.set(false);
          this.router.navigate(['/auth']);
        }, 3000)
      },
      error: (err) => {
        console.log('signup failed', err);
        setTimeout(() => {
          this.isLoading.set(false);
          this.errorMsg = 'Email already exist';
        }, 3000)
      }
    })

  }
}
