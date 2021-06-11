import { PlaceholderDirective } from './../shared/placeholder/placeholder.directive';
import { AlertComponent } from './../shared/alert/alert.component';
import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})

export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true
  isLoading = false
  error: string = null;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective

  private closeSub: Subscription;
  private storeSub: Subscription;


  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}



  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError

      if (this.error) {
        this.showErrorAlert(this.error)
      }
    })
  }



  onSwitch() {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError())
  }



  onSubmit(form: NgForm) {
    if (!form.valid) {
      return
    }
    const email = form.value.email
    const password = form.value.password

    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({
        email: email,
        password: password
      }))
    } else {
      this.store.dispatch(new AuthActions.SignupStart({
        email: email,
        password: password
      }))
    }

    form.reset()
  }



  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe()
    }
    this.storeSub.unsubscribe()
  }



  private showErrorAlert(errorMessage: string) {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    )
    const hostViewContainerRef = this.alertHost.viewContainerRef
    hostViewContainerRef.clear()

    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory)

    componentRef.instance.message = errorMessage
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe()
      hostViewContainerRef.clear()
    })
  }
}
