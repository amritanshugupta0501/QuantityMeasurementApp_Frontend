import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private socialAuthService = inject(SocialAuthService);
  private router = inject(Router);

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor() {
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        // Send idToken to our .NET api
        this.http.post<any>('/api/v1/auth/google', { token: user.idToken }).subscribe({
          next: (res) => {
            if (res && res.token) {
              localStorage.setItem('jwtToken', res.token);
              this.loggedInSubject.next(true);
              this.router.navigate(['/history']);
            }
          },
          error: (err) => console.error('Google login backend error', err)
        });
      }
    });
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  loginStandard(credentials: any) {
    return this.http.post<any>('/api/v1/auth/login', credentials).subscribe({
      next: (res) => {
        if (res && res.token) {
          localStorage.setItem('jwtToken', res.token);
          this.loggedInSubject.next(true);
          this.router.navigate(['/history']);
        }
      },
      error: (err) => alert('Login failed: ' + err.error)
    });
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.loggedInSubject.next(false);
    try {
      this.socialAuthService.signOut();
    } catch(e) {}
    this.router.navigate(['/']);
  }
}
