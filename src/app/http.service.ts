import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Admin} from './admin';

@Injectable()
export class HttpService{

    constructor(private http: HttpClient){ }
    postData(admin: Admin){
        if(admin.loader == 'register') {
            const body = {Password: admin.Password, adminName: admin.adminName};
            return this.http.post('http://localhost:3001/register', body);
        }else if(admin.loader == 'login') {
            const body = {Password: admin.Password, adminName: admin.adminName};
            return this.http.post('http://localhost:3001/login', body);
        }
    }
}

