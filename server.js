var express = require('express'); //requires the express library
var morgan = require('morgan'); //reqruires the morgan library
var mongoose = require('mongoose'); //requires the mongoose library
var bodyParser = require('body-parser'); //body-parser library
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo/es5')(session); //stores session on the server-side
var passport = require('passport');

var secret = require('./config/secret');
var User = require('./models/user');

var app = express(); //assigning the express library to a variable

mongoose.connect(secret.database, function(err) { //establishing connection to database
	if (err) {
		console.log(err);
	} else {
		console.log("Connected to the database");
	}
});

//Middleware
app.use(express.static(__dirname + '/public')); 
app.use(morgan('dev')); //using morgan with parameter dev. Morgan keeps log of all requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: secret.secretKey,
	store: new MongoStore({ url: secret.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
	res.locals.user = req.user;
	next();
});



app.engine('ejs', engine); // sets the type of engine 'ejs-engine' 
app.set('view engine', 'ejs'); // templating engine



var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');


app.use(mainRoutes);
app.use(userRoutes);



// app.get('/', function(req, res) {  //getting the custom route
// 	var name= "Farabi";
// 	res.json("My name is "+name);
// });

// app.get('/catname', function(req,res) {
// 	res.json('batman');
// });

app.listen(secret.port, function(err) {  //listen: method of express to listen the connection response through port 3000
	if (err) throw err;
	console.log("Server is Running on port "+secret.port);
});
