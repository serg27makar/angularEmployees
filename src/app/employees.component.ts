import { Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'employees-app',
    template: `
        <button (click)="exit()" >logout</button>
        <user-list></user-list>
    `
})
export class EmployeesComponent implements OnInit {
    constructor( private router: Router ){}

    exit(){
        localStorage.token = '';
        this.ngOnInit()
    }

    ngOnInit(){
        if(!localStorage.token || localStorage.token.length !== 24) {
            this.router.navigate([''])
        }
    }

}