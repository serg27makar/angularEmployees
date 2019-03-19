import { Component, OnInit } from '@angular/core';
import { HttpService} from './http.service';
import {Admin} from './admin';
import {Router} from '@angular/router';

@Component({
    selector: 'login-app',
    template: `
        <div class="login">
            <legend class="legend">Enter Name:</legend>
            <input class='logInp' name="adminName" [(ngModel)]="admin.adminName"/>
            <legend class="legend">Enter password:</legend>
            <input class='logInp' type='password' name="Password" [(ngModel)]="admin.Password"/>
            <br/>
            <button class="add" (click)="handleSubmitRegister(admin)" >Register</button>
            <button class="add" (click)="handleSubmitLogin(admin)" >Login</button>
        </div>
    `,
    styleUrls: ['./login.component.css'],
    providers: [HttpService]
})
export class LoginComponent implements OnInit {
    admin= Admin;
    constructor(private httpService: HttpService, private router: Router ){}
    handleSubmitRegister(admin: Admin){
        admin.loader= 'register';
        this.httpService.postData(admin)
            .subscribe(
                data => localStorage.token= data['_id']
            );
        setTimeout(() => { this.ngOnInit(); }, 150);
    }
    handleSubmitLogin(admin: Admin){
        admin.loader= 'login';
        this.httpService.postData(admin)
            .subscribe(
                data => localStorage.token= data['_id']
            );
        setTimeout(() => { this.ngOnInit(); }, 150);
    }
    ngOnInit(){
        if(localStorage.token && localStorage.token.length == 24) {
            this.router.navigate(['employees'])
        }
    }
}

