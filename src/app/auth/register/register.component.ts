import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {
  private authService = inject(AuthService);

  form = new FormGroup({
    email: new FormControl('', Validators['required']),
    password: new FormControl('', Validators['required'])
  })

  errorMsg: string | null = null;

  onSubmit(){
    if(!this.form.valid){
      return;
    }

    const email = this.form.value.email!;
    const password = this.form.value.password!;

    this.authService.signup(email, password).subscribe({
      next: (res) => {
        console.log('sigiup completed')
      },
      error: (err) => {
        console.log('signup failed')
      }
    })

  }
}
