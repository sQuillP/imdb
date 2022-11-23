import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { BehaviorSubject, Subject } from "rxjs";
import { MessageService } from "./message.service";
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

@Injectable({providedIn:'root'})
export class AuthService {

    userData:any;

    isLoggedIn = new BehaviorSubject<boolean>(false);

    
    constructor(
        private auth:AngularFireAuth,
        private messageService:MessageService
        ){
        
        this.auth.authState.subscribe((user)=> {
            if(user){
                this.userData = user;
                this.isLoggedIn.next(true);
                localStorage.setItem('user',JSON.stringify(this.userData));
                JSON.parse(localStorage.getItem('user')!);
            } else {
                this.isLoggedIn.next(false);
                localStorage.setItem('user',null);
                console.log(JSON.parse(localStorage.getItem('user')!));
            }
        })
    }



    signIn(email:string, password:string):Promise<boolean> {
        return this.auth.signInWithEmailAndPassword(email,password)
        .then(result => {
            this.userData = result.user;
            console.log('result from signing in',result);
            console.log(this.auth.user);
            return true;
        }).catch(error => {
            this.messageService.notifyError("Unable to login with credentials.");
            return false;
        });
    }

    signUp(email:string, password:string):Promise<boolean> {
        return this.auth.createUserWithEmailAndPassword(email,password)
        .then(user => {
            this.userData = user;
            console.log('result from signing up:',user);
            return true;
        })
        .catch(err => {
            this.messageService.notifyError("Problem with server, unable to register account.")
            return false
        });
    }

    setUserData(user:any):void {

    }

    signOut():Promise<boolean>{
        return this.auth.signOut().then(data => {
            console.log('signed out result',data);
            this.isLoggedIn.next(false);
            this.userData = null;
            return true;
        }).catch(error => {
            console.log(error)
            return false;
        });
    }
}