import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements AfterViewInit {

  constructor(private authService: AuthService) { }

  ngAfterViewInit() {
  }

  login(username: string, password: string): void {
    this.authService.login(username, password).subscribe();
  }

  signup(username: string, email: string, password1: string, password2: string): void {
    this.authService.signup(username, email, password1, password2).subscribe();
  }

  logout(): void {
    this.authService.logout();
  }

}
