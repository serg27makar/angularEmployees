const http =require('http');
const cors = require('cors');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useNewUrlParser: true });
const ObjectId = require("mongodb").ObjectId;
const server = http.createServer(app);
const io = require('socket.io').listen(server);

let dbEmployees;
let usersdb;

app.use(cors());

app.use('/resurse', express.static(__dirname + '/../public/resurs'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((request,response,next)=>{
        if(request.url === '/register' || request.url === '/login' ){
        next();
        return
    }
    const collection = request.app.locals.collection;
    let cookies = request.headers;
    if(!cookies.token){
        response.sendStatus(401);
        response.end();
        return
    }
    collection.findOne(ObjectId(cookies.token),function (err,res) {
        if (res) {
            response.send(res);
            next()
        }else {
            response.sendStatus(401);
            response.end();
        }
    });
});

mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbEmployees = client;
    app.locals.collection = client.db("dbEmployees").collection("admindb");
    usersdb = client.db("dbEmployees").collection('usersdb');
    server.listen(3001, function(){
        console.log("Сервер ожидает подключения...");
    });
});

app.get("/", function (request, response) {
    response.end();
});

app.post("/login", function (request, response) {
    if (!request.body) return response.sendStatus(400);
    const adminName = request.body.adminName;
    const Password = request.body.Password;
    const user = {Name: adminName, Password: Password};
    const collection = request.app.locals.collection;
    collection.findOne(user, function (err, result) {
        if(err) return console.log(err);
        if(!result){
            response.send('find:0');
            response.end()
        }else{
            response.send(result);
            response.end()
        }
    });
});

app.post("/register", function (request, response) {
    if (!request.body) return response.sendStatus(400);
    const adminName = request.body.adminName;
    const Password = request.body.Password;
    const user = {Name: adminName, Password: Password};
    const collection = request.app.locals.collection;
    collection.findOne(user, function (err, result) {
        if(err) return console.log(err);
        if(!result){
            collection.insertOne(user, function (err, res) {
                if (err) return console.log(err);
                response.send(res.ops[0]);
                response.end()
            });
        }else{
            response.send('find:1');
            response.end()
        }
    });
});


io.on('connection', (client)=>{

    client.on('findDouble', (user)=> {
    const userName = user.userName;
const department = user.department;
usersdb.find({userName: userName, department: department}).toArray(function (error, list) {
    client.emit('allFindDouble', list)
});
});

client.on('findUser', (user)=> {
    usersdb.find({userName: user}).toArray(function (error, list) {
    client.emit('allFindUser', list)
});
});

client.on('findUserDep', (user)=> {
    usersdb.find({department: user}).toArray(function (error, list) {
    client.emit('allFindUserDep', list)
});
});

client.on('usersAll', function () {
    usersdb.find({Us:'c'}).toArray(function(err, list){
        client.emit('usersAllRes', list)
    });
});

client.on('userIns', function (user) {
    const userName =user.userName;
    const notes =user.notes;
    const department = user.department;
    const User = {Us:'c', userName: userName,  department: department, notes: notes };
    usersdb.insertOne( User, function(err, list){
        client.emit('userInsRes', list)
    });
});

client.on('userDell', function (userId) {
    usersdb.findOneAndDelete( {_id:ObjectId(userId)}, function(err, result){
        if (err) return console.log(err);
        console.log(result);

    });
    client.emit('allUserDell')
});

client.on('userUpdate', function (user) {
    const userId = user.userId;
    const userName =user.userName;
    const notes =user.notes;
    const department = user.department;
    usersdb.findOneAndUpdate( {_id:ObjectId(userId)},{$set:{ userName: userName, department: department, notes: notes}}, function(err, list){
        client.emit('userUpdateRes', list)
    });
});

console.log('new connect');
});


process.on("SIGINT", () => {
    dbEmployees.close();
process.exit();
});
