import { AuthService } from './../auth/auth.service';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})


export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  isAuthenticated = false
  private userSub: Subscription

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user
    })
  }

  onSaveRecipes() {
    this.dataStorageService.saveRecipes()
  }

  onFetchRecipes() {
    this.dataStorageService.fetchRecipes().subscribe()
  }

  onLogout() {
    this.authService.logout()
  }

  ngOnDestroy() {
    this.userSub.unsubscribe()
  }
}
