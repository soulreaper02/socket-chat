const express = require('express');
const QPromise = require('q');
const _ = require('underscore');
const btoa = require('btoa');
const db = require('./databaseRedis/dbOps');
const config = require('./config');

let admins = {};
let users = {};


const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.set('port', (process.env.PORT || 3000));

db.ConnectToRedis(startUp);

/**
 * Client route
 */
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/client.html');
});

/**
 * Admin route
 * To change the path of the the admin interface edit the config file.
 */

 app.get(config.admin_url, (req, res) => {
     res.sendFile(__dirname + '/views/admin.html');
 });

//app configuration
app.use(express.static(__dirname + '/public'));

/**
 * Socket Implementation
 */

io.on('connection', (socket) => {
    /**
     * Check for admin login event
     */
    socket.on('login', (data) => {
        if (btoa(data.password) != config.password){
            socket.emit('login', {
                login: false,
                err: 'Invalid password'
            })
        } else if (_.find(config.admin_users, (admin) => {
            return (admin == data.admin); //will match with admin names in the array.
        })) {
            if (admins[data.admin]) {
                socket.emit('login', {
                    login: false,
                    err: 'Already logged In'
                })
            } else {
                socket.emit('login', {
                    login: true
                })
            }
        } else {
            socket.emit('login', {
                login: false,
                err: 'Invalid login'
            })
        }
    })
/**
 * Initalize admin
 */
    socket.on('add admin', (data) => {
        this.isAdmin = data.isAdmin;
        socket.username = data.admin;
        _.each(admins, (adminSocket) => {
            adminSocket.emit('admin added', socket.username)
            socket.emit('admin added', adminSocket.username)
        });
        admins[socket.username] = socket;

        //If some users are already online on chat
        if (Object.keys(users).length > 0 ) {
            _.each(users, (userSocket) => {
                
            })
        }
    });

});



/**
 * Check if redis is running
 * start the server.
 */

 function startUp(isTrue) {
     if (isTrue) {
        server.listen(app.get('port'), function() {
            const url = 'http://localhost:' + app.set('port');
            console.log('Application running on port:', app.get('port'), 'URL :', url);
          });
     } else {
         console.log('Server not running');
     }
 }
