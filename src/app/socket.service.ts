import * as io from "socket.io-client";
import {Injectable} from '@angular/core';

@Injectable()
export class SocketService {

    private host = "http://localhost:3001/";
    private socket: any;

    constructor() {
        this.socket = io(this.host);

    }

    usersAll(call: any) {
        this.socket.on('usersAllRes', (res: any, err: any) => {
            call(res);
            console.log(err);
        });
        this.socket.emit('usersAll');
    }

    userIns(data: any) {
        let user = {
            userName: data.userName,
            department: data.department,
            notes: data.notes,
        };

        this.socket.on('userInsRes', (res: any, err: any) => {
            console.log(err);
        });
        this.socket.emit('userIns', user);
    }

    userUpdate(data: any) {
        let user = {
            userId: data._id,
            userName: data.userName,
            department: data.department,
            notes: data.notes,
        };
        this.socket.on('userUpdateRes', (res: any, err: any) => {
            console.log(err);
        });
        this.socket.emit('userUpdate', user);
    }

    findUser(user: any, call: any) {
        this.socket.on('allFindUser', (res: any, err: any) => {
            call(res);
            console.log(err);
        });
        this.socket.emit('findUser', user);
    }

    findDouble(user: any, call: any) {
        this.socket.on('allFindDouble', (res: any, err: any) => {
            call(res);
            console.log(err);
        });
        this.socket.emit('findDouble', user);
    }

    findUserDep(user: any, call: any) {
        this.socket.on('allFindUserDep', (res: any, err: any) => {
            call(res);
            console.log(err);
        });
        this.socket.emit('findUserDep', user);
    }

    userDell(data: any) {
        this.socket.on('allUserDell', (res: any, err: any) => {
            console.log(err);
        });
        this.socket.emit('userDell', data);
    }

}