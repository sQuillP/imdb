import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  displayPopup:boolean = false;
  mode:string = "login";
  accountStatusSubscription:Subscription;
  isLoggedIn:boolean;

  errorMessage:string;
  errorSubscription:Subscription;
  constructor(
    private authService:AuthService, 
    private messageService:MessageService) { 

  }

  ngOnInit(): void {
    this.errorMessage = this.messageService.error;
    this.errorSubscription = this.messageService.errorSubject.subscribe(error => {
      this.errorMessage = error;
    })
    this.isLoggedIn = !!this.authService.userData;
    this.accountStatusSubscription= this.authService.isLoggedIn.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
  }

  onDisplayLoginForm(mode:string):void {
    this.mode = mode;
    this.displayPopup = true;
  }

  onDismissLoginForm(event:any):void {
    this.displayPopup = event;
  }

  onSignOut():void{
    this.authService.signOut();
  }

  onDismissError():void{
    this.errorMessage = "";
    this.messageService.clearError();
  }

}
