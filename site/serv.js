var  express = require('express');
var http = require('http');
var app = express();
serv = http.createServer(app);
var io = require("./node_modules/socket.io").listen(serv);

serv.listen(7421);

app.get('/', function(req,res){
	res.sendfile(__dirname + '/index.html');
});

var usernames = {};

io.sockets.on('connection', function (sokt){
	sokt.on('sendchat', function (data){
		io.sockets.emit('updatechat', sokt.username, data);
	});
	sokt.on('adduser', function(username){
		sokt.username = username;
		usernames[username] = username;
		sokt.emit('updatechat', 'SERVER','You have connected');
		sokt.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		io.sockets.emit('updateusers', usernames);
	});
	sokt.on('disconnect', function(){
		delete usernames[sokt.username];
		io.sockets.emit('updateusers', usernames);
		sokt.brodcast.emit('updatechat', 'SERVER', sokt.username + ' has disconnected');
	});
});

