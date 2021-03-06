///<referance path="./typings/tsd.d.ts"/>
"use strict";
var express = require('express');
var session = require('express-session');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
//Creating an Instance.
var app = express();
//Configuring port.
var port = process.env.PORT | 3000;
//Configuring Server.
var server = app.listen(port, function () {
    var listening_port = server.address().port;
    ;
    console.log("Listening on : " + listening_port);
});
//Mongodb connection.
mongoose.connect('mongodb://localhost/sessions');
//Mongodb Schema.
var session_schema = new mongoose.Schema({ user: String, status: Boolean });
//Mongodb Schema Model.
var session_model = mongoose.model('Session Model', session_schema, 'Sessions');
var user = "Shahzaib";
var pass = "123456";
var user2 = "Bruce";
var pass2 = "123456";
app.use(session({
    genid: function (req) {
        return (Date.now().toString()); // use UUIDs for session IDs 
    },
    secret: '123456789'
}));
//Bodyparser.
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.set('views', './../views');
//app.set('view engine','ejs');
//Rendering Angular 2 App.
app.use(express.static(path.resolve(__dirname, './../../client')));
app.post('/api/login', function (req, res) {
    //req.session["isLogin"] = true;  
    //req.session["user"] = JSON.parse(user);
    res.send(req.session);
    console.log(req.session);
    if (req.body.username == user && req.body.password == pass) {
        console.log("Logged In");
        req.session["isLogin"] = true;
        req.session["username"] = user;
        console.log("User : " + req.body.username);
        console.log(req.body);
        //Storing in database.
        var data = new session_model({
            user: req.session["username"],
            status: req.session["isLogin"]
        });
        data.save();
    }
    else if (req.body.username == user2 && req.body.password == pass2) {
        console.log("Logged In (User2)");
        req.session["isLogin"] = true;
        req.session["username"] = user2;
        console.log("User : " + req.body.username);
        //Storing in database.
        var data = new session_model({
            user: req.session["username"],
            status: req.session["isLogin"]
        });
        data.save();
    }
    else {
        console.log("User not Found");
    }
});
