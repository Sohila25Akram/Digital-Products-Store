import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  // private destroy$ = new Subject<void>();
  // private router = inject(Router);
  // private ngZone = inject(NgZone);

  // isLoggged = signal(false);
  // currentForm : 'Login' | 'Signup' = 'Signup';
  // isError = signal(false);
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
        console.log('login successed')
      },
      error: (err) => {
        console.log('error in login')
      }
    })

    // if(this.authService.login(email, password)){
    //   console.log('login successed');
    //   this.errorMsg = null;
    // }else{
    //   this.errorMsg='invalid email or password'
    // }
  }

  // ngOnDestroy(): void {
  //    this.destroy$.next();
  //   this.destroy$.complete();
  // }
}
