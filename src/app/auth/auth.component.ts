import { PlaceholderDirective } from './../shared/placeholder/placeholder.directive';
import { AlertComponent } from './../shared/alert/alert.component';
import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AuthResponseData, AuthService } from "./auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})

export class AuthComponent implements OnDestroy {
  isLoginMode = true
  isLoading = false
  error: string = null;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective

  private closeSub: Subscription;


  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}



  onSwitch() {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError() {
    this.error = null;
  }



  onSubmit(form: NgForm) {
    if (!form.valid) {
      return
    }
    const email = form.value.email
    const password = form.value.password

    let authObs: Observable<AuthResponseData>

    this.isLoading = true

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password)
    } else {
      authObs = this.authService.signup(email, password)
    }

    authObs.subscribe(responseData => {
      this.isLoading = false
      this.router.navigate(['/recipes'])
    }, errorMessage => {
        console.log(errorMessage)
        this.error = errorMessage
        this.showErrorAlert(errorMessage)
        this.isLoading = false
    })

    form.reset()
  }



  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe()
    }
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
