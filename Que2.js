var express = require('express');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.set('strictQuery', false);
var app = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)

// Import Express Handlebars module
const exphbs = require("express-handlebars");
const handlebars = require("handlebars")

var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

mongoose.connect(database.url);

var Product = require('./models/products');
const products = require('./models/products');


app.use(express.static(path.join(__dirname, "public")));

// Set up Handlebars as the view engine for the application
app.engine(".hbs", exphbs.engine({ extname: ".hbs", defaultLayout: 'main' }));
app.set("view engine", ".hbs");


app.get("/",function(req, res){
    res.render('index');
})

app.get("/data", function (req, res) {
    Product.find()
        .then(function (products) {
            res.render('allData', { data: JSON.parse(JSON.stringify(products)).slice(0,10) }); // send the products data as JSON
        })
        .catch(function (err) {
            res.status(500).send(err); // send 500 status code and the error message
        });

});

app.get("/addproduct", function (req, res) {
    res.render('addProduct');

});

app.post("/addproduct", function (req, res) {
    Product.create({
        asin: req.body.asin,
        title: req.body.title,
        imgUrl: req.body.imgUrl,
        stars: req.body.stars,
        reviews: req.body.reviews,
        price: req.body.price,
        listPrice: req.body.listPrice,
        categoryName: req.body.categoryName,
        boughtInLastMonth: req.body.boughtInLastMonth
    }, function (err, product) {
        if (err)
            res.send(err);

        // get and return all the employees after newly created employe record
        Product.findOne({ asin: req.body.asin }, function (err, product) {
            if (err)
                res.send(err);
            if (product) {
                res.render('success',{productasin:`${product.asin}`});
            } else {
                res.status(404).render('error',{ message: "Product not found" });
            }
        });
    });
});



//get all products data from db
app.get('/allData', function (req, res) {
    Product.find()
        .then(function (products) {
            res.json(products); // send the products data as JSON
        })
        .catch(function (err) {
            res.status(500).send(err); // send 500 status code and the error message
        });
});

// get a employee with ID of 1
app.get('/data/product/:prod_id', function (req, res) {
    let id = req.params.prod_id;
    Product.findById(id, function (err, product) {
        if (err)
            res.send(err)

        res.json(product);
    });

});


// create employee and send back all employees after creation
app.post('/data/product', function (req, res) {

    // create mongose method to create a new record into collection
    console.log(req.body);

    Product.create({
        asin: req.body.asin,
        title: req.body.title,
        imgUrl: req.body.imgUrl,
        stars: req.body.stars,
        reviews: req.body.reviews,
        price: req.body.price,
        listPrice: req.body.listPrice,
        categoryName: req.body.categoryName,
        boughtInLastMonth: req.body.boughtInLastMonth
    }, function (err, product) {
        if (err)
            res.send(err);

        // get and return all the employees after newly created employe record
        Product.findOne({ asin: req.body.asin }, function (err, product) {
            if (err)
                res.send(err);
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ message: "Product not found" });
            }
        });
    });

});


// create employee and send back all employees after creation
app.put('/data/product/:asin', function (req, res) {
    // create mongose method to update an existing record into collection
    console.log(req.body);

    let asin_id = req.params.asin;
    var data = {
        title: req.body.title,
        price: req.body.price
    }

    // save the user
    Product.findOne({ asin: asin_id }, data, function (err, product) {
        if (err) throw err;

        res.send('Successfully! Product updated - ' + product.title);
    });
});

// delete a employee by id
app.delete('/data/product/:asin', function (req, res) {
    console.log(req.params.asin);
    let asin_id = req.params.asin;
    Product.remove({
        asin: asin_id
    }, function (err) {
        if (err)
            res.send(err);
        else
            res.send('Successfully! Product has been Deleted.');
    });
});
app.get("*", function(req, res){
    res.status(400).render('error',{message:"Something went wrong!!!"})
})

app.listen(port);
console.log("App listening on port : " + port);
