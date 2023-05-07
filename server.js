let express = require('express');
let app = express();
let server = app.listen(8080);
let io = require('socket.io')(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('index');
});

const messages = [];

io.on('connection', function(socket) {
    socket.emit('all_messages', messages);

    socket.on('new_user', function(username) {
        console.log(username + ' joined the chat');
        const message = username + ' joined the game!';
        messages.push(message);
        io.emit('user_joined', message);

        socket.on('disconnect', function() {
            console.log(username + ' left the chat');
            const leaveMessage = username + ' left the game!';
            messages.push(leaveMessage);
            io.emit('user_left', leaveMessage);
        });
    });

    socket.on('chat_message', function(message) {
        messages.push(message);
        io.emit('new_chat_message', message);
    });

    socket.on('user_won', function(message) {
        messages.push(message);
        io.emit('new_chat_message', message);
    });
});


