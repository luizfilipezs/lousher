import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements AfterViewInit {

  public errorWhenLoggingIn = false;
  public errorWhenRegistering = false;

  constructor(private authService: AuthService) { }

  ngAfterViewInit() {
  }

  login(username: string, password: string): void {
    if (username && password) {
      this.authService.login(username, password)
        .subscribe(
          (sucess) => this.errorWhenLoggingIn = false,
          (error) => this.errorWhenLoggingIn = true
        );
    } else {
      this.errorWhenLoggingIn = true;
    }
  }

  signup(username: string, email: string, password1: string, password2: string): void {
    if (username && email && password1 && password2) {
      this.authService.signup(username, email, password1, password2)
        .subscribe(
          (sucess) => this.errorWhenRegistering = false,
          (error) => this.errorWhenRegistering = true
        );
    } else {
      this.errorWhenRegistering = true;
    }
  }

  logout(): void {
    this.authService.logout();
  }

}
