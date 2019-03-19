import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import { HttpClientModule }   from '@angular/common/http';
import { SocketService} from "./socket.service"
import { AppComponent }   from './app.component';
import { EmployeesComponent }   from './employees.component';
import { LoginComponent }   from './login.component';
import {UserlistComponent} from "./userlist.component";

const appRoutes: Routes =[
    { path: '', component: LoginComponent},
    { path: 'employees', component: EmployeesComponent},
];

@NgModule({
    imports:      [ BrowserModule, RouterModule.forRoot(appRoutes), FormsModule, HttpClientModule],
    declarations: [ AppComponent, LoginComponent, EmployeesComponent, UserlistComponent ],
    providers: [ SocketService ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }