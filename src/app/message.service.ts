import { Injectable } from "@angular/core";
import { Subject } from "rxjs";


@Injectable({providedIn:'root'})
export class MessageService {

    private _error:string;

    private _message:string;

    messageSubject = new Subject<string>();

    errorSubject = new Subject<string>();

    constructor(){}

    get error():string{return this._error;}

    notifyError(error:string):void{
        this._error = error;
        this.errorSubject.next(error);
    }

    notifyMessage(message:string):void {
        this._message = message;
        this.messageSubject.next(message);
    }

    clearError():void{this._error = '';}
}