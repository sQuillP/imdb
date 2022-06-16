import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @Input() mode:string = "login";

  //NOTE: emit 'false' when you wait to remove this component from viewing
  @Output() dismissPopup = new EventEmitter<boolean>();

  loginUser:FormGroup;
  formError:boolean = false;
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.loginUser = new FormGroup({
      "email": new FormControl(null, [Validators.required,Validators.email]),
      "password": new FormControl(null, [Validators.required])
    });
  }


  validateCredentials():boolean {
    let emailConfig:any = this.loginUser.get('email');
    let passwordConfig:any = this.loginUser.get('password');

    return !emailConfig.errors && !passwordConfig.errors;
  }

  onDismissPopup():void {
    this.dismissPopup.emit(false);
  }


  onSubmit(mode:string):void{
    let email:string = this.loginUser.get('email').value;
    let password:string = this.loginUser.get('password').value;
    if(!this.validateCredentials())
      return;
    if(mode ==='login')
      this.authService.signIn(email,password).then(success => {
        if(success)
          this.dismissPopup.emit(false);
      });
    else
      this.authService.signUp(email,password).then(success => {
        if(success)
          this.dismissPopup.emit(false);
      });

  }
}
