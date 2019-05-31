const express = require("express")
require('dotenv').config()
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const session = require('express-session');
const MySQLStore = require('connect-mysql')(session)



const PORT = process.env.PORT || 3000;

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        expires: 1000 * 60 * 60 * 24 * 3
    },
    store: new MySQLStore({
        config: {
            user: process.env.DBUser,
            password: process.env.DBPassword,
            database: process.env.DB
        }
    })
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'pug')
app.set('views', './views')

// Routes
app.use(express.static("./public"));
require("./routes")(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
  
io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });
  
// Starts the server to begin listening
server.listen(PORT, function () {
    
    console.log("App listening on PORT " + PORT);
});

