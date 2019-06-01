'use strict';

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const ent = require('ent');
const db = require('./db');
app.set('view engine', 'jade');

app.get('/', (req, res) => {
    res.render('index');
})
app.get('/admin', (req, res) => {
    res.render('admin');
})
app.get('/adminjs', function (req, res) {
    res.sendFile(__dirname + "/admin.js")
})
app.get('/client', function (req, res) {
    res.sendFile(__dirname + "/client.js")
})

app.get('/api', function (req, res) {
    res.sendFile(__dirname + "/db.json")
})

app.get('/style', function (req, res) {
    res.sendFile(__dirname + "/views/style.css")
})

io.sockets.on('connection', function (socket, username) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('admin', function(username, discussion_id) {
        db.discussion = {
            "id": discussion_id,
            "username": username,
            "all": false
        }
        socket.username = username;
        discussion_id = socket.id;
        socket.broadcast.emit('admin', username, discussion_id);
    });
    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message, username, discussion_id) {
        message = ent.encode(message);
        username = socket.username;
        discussion_id = socket.id;
        db.messages = {
            "discussion_id": discussion_id,
            "users": username,
            "body": message
        }
        socket.broadcast.emit('message', {username: socket.username, message: message});
        console.log(username + ':' + message)
    });
});

server.listen(3000);