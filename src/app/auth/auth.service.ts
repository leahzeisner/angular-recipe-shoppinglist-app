import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from '../../environments/environment'


export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}



@Injectable({
  providedIn: 'root'
})

export class AuthService {

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  signup(email: string, password: string) {
    return this.http
    .post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(catchError(this.handleError), tap(responseData => {
      this.handleAuthentication(
        responseData.email,
        responseData.localId,
        responseData.idToken,
        +responseData.expiresIn
      )
    }))
  }



  login(email: string, password: string) {
    return this.http
    .post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(catchError(this.handleError), tap(responseData => {
      this.handleAuthentication(
        responseData.email,
        responseData.localId,
        responseData.idToken,
        +responseData.expiresIn
      )
    }))
  }



  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'))
    if (!userData) {
      return
    }

    const tokenExpiration = new Date(userData._tokenExpirationDate)

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      tokenExpiration
    )

    if (loadedUser.token) {
      this.user.next(loadedUser)
      const expirationDuration = tokenExpiration.getTime() - new Date().getTime()
      this.autoLogout(expirationDuration)
    }
  }



  logout() {
    this.user.next(null)
    this.router.navigate(['/auth'])
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null
  }



  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout()
    }, expirationDuration)
  }



  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000)

    const user = new User(email, userId, token, expirationDate
    )
    this.user.next(user)
    this.autoLogout(expiresIn * 1000)
    localStorage.setItem('userData', JSON.stringify(user))
  }



  private handleError(errorRes: HttpErrorResponse) {
    let error = 'An unknown error occurred!';

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(error)
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        error = 'Email already exists!'
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        error = 'Invalid email and/or password!'
    }

    return throwError(error)
  }
}
