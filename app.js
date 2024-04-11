require('dotenv').config()
var express  = require('express');
var path = require('path');
var mongoose = require('mongoose');
var db = require('./Database/db.js');
var app      = express();
var database = require('./Database/config.js');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
const exphbs = require("express-handlebars");
var Movie = require('./models/movie');

var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json

app.use(express.static(path.join(__dirname, "public")));

// Set up Handlebars as the view engine for the application
app.engine(".hbs", exphbs.engine({ extname: ".hbs", defaultLayout: 'main' }));
app.set("view engine", ".hbs");





app.get('/',function(req, res){
    res.render('index');
});

app.get('/addmovie',function(req, res){
    res.render('addmovie');
});
app.get('/deletemovie',function(req, res){
    res.render('deletemovie');
});
app.get('/getmovies',function(req, res){
    res.render('getmovies');
});
app.get('/updatemovie',function(req, res){
    res.render('updatemovie');
});

app.get('/api/movies',function(req, res){
    Movie.find()
    .then(function (movies) {
        res.json(movies)
     // send the products data as JSON
    })
    .catch(function (err) {
        res.status(500).send(err); // send 500 status code and the error message
    });
})

app.put('/api/movies/:id', function(req, res){
    console.log(req.params.id)
    res.render('success', { message: req.params.id });
});


app.delete('/api/movies/:employee_id', function(req, res) {
	console.log(req.params.employee_id);
	let id = req.params.employee_id;
	Employee.remove({
		_id : id
	}, function(err) {
		if (err)
			res.send(err);
		else
			res.send('Successfully! Employee has been Deleted.');	
	});
});






(async () => {
    try {
      await db.initialize(database.url);
      app.listen(port, () => {
        console.log("App listening on port: " + port);
      });
    } catch (error) {
      console.error('Error initializing database:', error);
      process.exit(1);
    }
  })();