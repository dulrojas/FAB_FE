import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  constructor(private router: Router) {}

  login(userData: any): void {
    localStorage.setItem('isLoggedin', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  logout(): void {
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedin') === 'true';
  }

  getUserData(): any {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }
}
