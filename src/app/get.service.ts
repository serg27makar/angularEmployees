import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class HttpServiceGet{

    constructor(private http: HttpClient){ }
    getData(){
            return this.http.get('http://localhost:3001/', {headers: {token: localStorage.token}})

    }
}

