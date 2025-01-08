import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    isLoggedIn(): boolean {
        return !!localStorage.getItem('isLoggedin');
    }

    logout(): void {
        localStorage.clear();
    }
}
