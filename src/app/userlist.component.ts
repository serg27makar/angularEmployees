import {TemplateRef, ViewChild} from '@angular/core';
import {Component, OnInit} from '@angular/core';
import {User} from './user';
import {SocketService} from './socket.service';

@Component({
    selector: 'user-list',
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.css'],
    providers: [SocketService]

})
export class UserlistComponent implements OnInit {
    //типы шаблонов
    @ViewChild('readOnlyTemplate') readOnlyTemplate: TemplateRef<any>;
    @ViewChild('editTemplate') editTemplate: TemplateRef<any>;
    @ViewChild('addTemplate') addTemplate: TemplateRef<any>;
    @ViewChild('infoTemplate') infoTemplate: TemplateRef<any>;
    @ViewChild('dellTemplate') dellTemplate: TemplateRef<any>;

    editedUser: User;
    users: Array<User>;
    isNewRecord: boolean;
    dellRecord: boolean;

    constructor(private serv: SocketService) {
        this.users = new Array<User>();
    }
    //первичная загрузка юзеров
    ngOnInit() {
        this.loadUsers();
    }

    //загрузка всех юзеров
    private loadUsers() {
        this.serv.usersAll((data: User[]) => {
            this.users = data;
        });
        this.editedUser = null;
        this.isNewRecord = true;
        this.dellRecord = false;
    }
    //поиск юзеров по имени или отделу
    search(editedUser: User){
        if(editedUser && editedUser.userName && editedUser.department){
            let findUser = {
                userName: editedUser.userName,
                department: editedUser.department
            };
            this.serv.findDouble(findUser, (data: User[])=>{
                this.users = data;
            });
        }else if(editedUser && editedUser.userName && !editedUser.department){
            this.serv.findUser(editedUser.userName, (data: User[])=>{
                this.users = data;
            });
        }else if(editedUser && !editedUser.userName && editedUser.department){
            this.serv.findUserDep(editedUser.department, (data: User[])=>{
                this.users = data;
            });
        }
        this.editedUser = null;
        this.isNewRecord = true;
    }
    // выбор и загрузка шаблонов
    loadTemplate(user: User) {
        if (this.editedUser && this.editedUser._id.length !== 24) {
            return this.addTemplate;
        }else if(this.editedUser && this.isNewRecord == true && this.editedUser._id.length == 24 && this.dellRecord == false){
            return this.editTemplate;
        }else if(this.editedUser && this.isNewRecord == false){
            return this.infoTemplate;
        }else if(this.editedUser && this.dellRecord == true){
            return this.dellTemplate;
        } else {
            return this.readOnlyTemplate;
        }
    }
    // удаление пользователя
    deleteUser(user: User) {
        this.serv.userDell(user._id);
        this.loadUsers();
    }
    dell(user: User){
        this.editedUser = new User(user._id, user.userName, user.department, user.notes);
        this.dellRecord = true;
    }

    // редактирование пользователя
    updateUser(editedUser: User){
        this.serv.userUpdate(editedUser);
        this.loadUsers();
    }
    editUser(user: User) {
        this.editedUser = new User(user._id, user.userName, user.department, user.notes);
    }

    // добавление пользователя
    createUser(editedUser: User){
        this.serv.userIns(editedUser);
        this.loadUsers();
    }
    addUser() {
        this.editedUser = new User("","","","");
    }

    // информ блок
    infoUser(user: User){
        this.editedUser = user;
        this.isNewRecord = false;
    }
    // отмена действий
    cancel() {
        this.editedUser = null;
        this.isNewRecord = true;
        this.dellRecord = false;
    }

}