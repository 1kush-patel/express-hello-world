require('dotenv').config()
var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var path = require('path');
var mongoose = require('mongoose');
var db = require('./Database/db.js');
var cors = require('cors')
var app = express();
var database = require('./Database/config.js');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
const cookieParser = require('cookie-parser');
const exphbs = require("express-handlebars");
var Movie = require('./models/movie.js');
var User = require('./models/user.js');
const { Result } = require('express-validator');
const { createSecretKey } = require('crypto');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { type } = require('os');
var currentUser;
const SecretKey = process.env.SecretKey;

var port = process.env.PORT || 8000;
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json

app.use(express.static(path.join(__dirname, "public")));

// Set up Handlebars as the view engine for the application
app.engine(".hbs", exphbs.engine({ extname: ".hbs", defaultLayout: 'main' }));
app.set("view engine", ".hbs");



const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'Movie flix API Documentation',
        version: '1.0.0',
        description: 'Documentation for movie flix API',
      },
      definitions:{
        Movie: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'The title of the movie.' },
            plot: { type: 'string', description: 'The plot summary of the movie.' },
            genres: { type: 'array', items: { type: 'string' }, description: 'An array of genres associated with the movie.' },
            runtime: { type: 'number', description: 'The runtime of the movie in minutes.' },
            cast: { type: 'array', items: { type: 'string' }, description: 'An array of actors cast in the movie.' },
            poster: { type: 'string', description: 'URL or path to the movie poster image.' },
            fullplot: { type: 'string', description: 'The full plot summary of the movie.' },
            languages: { type: 'array', items: { type: 'string' }, description: 'An array of languages spoken in the movie.' },
            released: { type: 'string', format: 'date', description: 'The release date of the movie.' },
            directors: { type: 'array', items: { type: 'string' }, description: 'An array of directors of the movie.' },
            rated: { type: 'string', description: 'The rating of the movie.' },
            awards: {
              type: 'object',
              properties: {
                wins: { type: 'number', description: 'The number of awards won.' },
                nominations: { type: 'number', description: 'The number of nominations received.' },
                text: { type: 'string', description: 'Textual description of the awards.' },
                lastupdated: { type: 'string', description: 'Date when the awards information was last updated.' }
              }
            },
            year: { type: 'number', description: 'The year of release of the movie.' },
            imdb: {
              type: 'object',
              properties: {
                rating: { type: 'number', description: 'IMDb rating of the movie.' },
                votes: { type: 'number', description: 'Number of votes received on IMDb.' },
                id: { type: 'number', description: 'IMDb ID of the movie.' }
              }
            },
            countries: { type: 'array', items: { type: 'string' }, description: 'An array of countries where the movie was produced or released.' },
            type: { type: 'string', description: 'Type of the movie (e.g., movie, series).' },
            tomatoes: {
              type: 'object',
              properties: {
                viewer: {
                  type: 'object',
                  properties: {
                    fresh: { type: 'number', description: 'Number of fresh ratings on Rotten Tomatoes.' },
                    critic: {
                      type: 'object',
                      properties: {
                        rotten: { type: 'number', description: 'Number of rotten ratings on Rotten Tomatoes.' },
                        lastUpdated: { type: 'string', format: 'date-time', description: 'Date when the critic ratings were last updated.' }
                      }
                    }
                  }
                },
                num_mflix_comments: { type: 'number', description: 'Number of comments on the movie in the MongoDB dataset.' }
              }
            }
          }
        },
        Update_Movie: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  plot: { type: 'string' },
                  genres: { type: 'array', items: { type: 'string' } },
                  cast: { type: 'array', items: { type: 'string' } },
                  languages: { type: 'array', items: { type: 'string' } },
                  awards: {
                    type: 'object',
                    properties: {
                      text: { type: 'string' },
                    },
                  },
                  imdb: {
                    type: 'object',
                    properties: {
                      rating: { type: 'string' },
                    },
                  },
             }
          }
        },
      }
    ,
    apis: ['app.js'], // Path to the API routes file(s)
  };
  
  // Initialize swagger-jsdoc
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  
  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



 /**
 * @swagger
 * /:
 *   get:
 *     summary: Home page
 *     description: It will return the home page from where you can perform all the oprerations.
 *     responses:
 *       200:
 *         description: Home page will be render.
 */ 
app.get('/', function (req, res) {
    res.status(200).render('index');
});


/**
 * @swagger
 * /addmovie:
 *   get:
 *     summary: Add Movie
 *     description: It will return the form where you can add the details of the movie.
 *     responses:
 *       200:
 *         description: Form for adding movie be render.
 */ 

app.get('/addmovie', function (req, res) {
    res.status(200).render('addmovie');
});

/**
 * @swagger
 * /deletemovie:
 *   get:
 *     summary: Delete Movie
 *     description: It will return the form where you can delete a movie.
 *     responses:
 *       200:
 *         description: Form for deleting movie will be rendered.
 */

app.get('/deletemovie', function (req, res) {
    res.status(200).render('deletemovie');
});

/**
 * @swagger
 * /getmovies:
 *   get:
 *     summary: Get Movies
 *     description: It will return the form where you can get a list of movies.
 *     responses:
 *       200:
 *         description: Form for getting movies will be rendered.
 */

app.get('/getmovies', function (req, res) {
    res.status(200).render('getmovies');
});

/**
 * @swagger
 * /updatemovie:
 *   get:
 *     summary: Update Movie
 *     description: It will return the form where you can update a movie.
 *     responses:
 *       200:
 *         description: Form for updating movie will be rendered.
 */

app.get('/updatemovie', function (req, res) {
    res.status(200).render('updatemovie');
});


/**
 * @swagger
 * /login:
 *   get:
 *     summary: User Login
 *     description: It will return the form where users can login.
 *     responses:
 *       200:
 *         description: Form for user login will be rendered.
 */

app.get('/login', function (req, res) {
    res.status(200).render('login');
})

/**
 * @swagger
 * /register:
 *   get:
 *     summary: User Registration
 *     description: It will return the form where users can register.
 *     responses:
 *       200:
 *         description: Form for user registration will be rendered.
 */

app.get('/register', function (req, res) {
    res.status(200).render('register');
})


/**
 * @swagger
 * /api/movies/signup:
 *   post:
 *     summary: User Registration API
 *     description: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request - invalid input.
 */

app.post('/api/movies/signup', function (req, res) {
    const userName = req.body.username;
    const passWord = req.body.password;
    const userEmail = req.body.email;

    //hashing the password and user creation 
    bcrypt.hash(passWord, 10)
        .then(hash => {
            User.create({
                name: userName,
                email: userEmail,
                password: hash
            });
        }
        )
        .catch(err => {
            res.status(400).send();
        }
        );

    res.status(200).send();
});

/**
 * @swagger
 * /api/movies/login:
 *  post:
 *    summary: User Login API
 *    description: Authenticate a user and generate JWT token.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: User authenticated successfully and JWT token generated.
 *      401:
 *        description: Unauthorized - invalid credentials.
 *      500:
 *        description: Internal server error.
 */



app.post('/api/movies/login', function (req, res) {
    const userName = req.body.username;
    const passWord = req.body.password;

    //matching the hash of the user creds

    User.find({ name: userName }).exec()
        .then(users => {
            if (!users[0]) {
                console.log(users);
                res.status(404).send('User does not exist');
            } else {
                console.log(users[0].password);
                bcrypt.compare(passWord, users[0].password)
                    .then(result => {
                        if (result) {
                            currentUser = { username: userName, password: passWord };
                            var jwToken = jwt.sign({ username: userName, password: passWord }, SecretKey)

                            res.cookie('accessToken', jwToken, { maxAge: 900000 });

                            res.status(200).send();
                        } else {
                            res.status(401).send('Incorrect password'); // Set status code to 500 for "Internal Server Error"
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).send('Internal Server Error'); // Set status code to 500 for "Internal Server Error"
                    });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error'); // Set status code to 500 for "Internal Server Error"
        });
});

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get Movies
 *     description: Get a paginated list of movies.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 30
 *         description: Number of movies per page.
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Title of the movie(optional).
 *     responses:
 *       200:
 *         description: Paginated list of movies retrieved successfully.
 *       500:
 *         description: Internal server error.
 */

app.get('/api/movies', function (req, res) {
    var page = parseInt(req.query.page) || 1;
    var perPage = parseInt(req.query.perPage) || 10;
    var title = req.query.title;
    perPage = perPage > 30 ? 30 : perPage;
    // Calculate skip value
    const skip = (page - 1) * perPage;

    // Query the database for total count of movies
    Movie.countDocuments()
        .then(function (totalCount) {
            // Calculate total number of pages
            const totalPages = Math.ceil(totalCount / perPage);
            // Query the database for paginated results
            Movie.find()
                .skip(skip)
                .limit(perPage)
                .then(function (movies) {
                    const pages = [];
                    const visiblePages = 7;
                    const middlePage = Math.floor(visiblePages / 2) + 1;
                    let startPage = page - middlePage + 1;
                    startPage = startPage < 1 ? 1 : startPage;
                    const endPage = Math.min(startPage + visiblePages - 1, totalPages);

                    for (let i = startPage; i <= endPage; i++) {
                        pages.push(i);
                    }
                    // Send response with paginated results and pagination metadata
                    res.status(200).render('getmovies', { data: JSON.parse(JSON.stringify(movies)), pages: JSON.parse(JSON.stringify(pages)), currentPage: page, totalPages: totalPages, perPage: perPage, title: title });

                })
                .catch(function (err) {
                    res.status(500).send(err);
                });
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
});

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Get Movie by ID
 *     description: Get details of a specific movie by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the movie to retrieve.
 *     responses:
 *       200:
 *         description: Details of the movie retrieved successfully.
 *       500:
 *         description: Internal server error.
 */

app.get('/api/movies/:id', function (req, res) {
    const id = req.params.id;

            Movie.findById({_id:id})
                .then(function (movie) {
                    console.log(movie)
                    res.status(200).render('movieModal', { movie: JSON.parse(JSON.stringify(movie))});
                })
                .catch(function (err) {
                    res.status(500).send(err);
                });
});

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Add Movie
 *     description: Add a new movie to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Movie'
 *     responses:
 *       200:
 *         description: Movie added successfully.
 *       500:
 *         description: Internal server error.
 */

app.post('/api/movies', authenticateUser, function (req, res) {

    const record = req.body;
    Movie.create(record)
        .then(function (movies) {
            res.status(200).send("Movvie added successfully.");
            console.log(movies);
        })
        .catch(function (err) {
            res.status(500).send(err); // send 500 status code and the error message
        });
})

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Update Movie
 *     description: Update details of a specific movie by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the movie to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Update_Movie'
 *     responses:
 *       200:
 *         description: Movie updated successfully.
 *       500:
 *         description: Internal server error.
 */

app.put('/api/movies/:id',authenticateUser, function (req, res) {
    console.log(req.body);

    var record = req.body; 

	// save the user
	Movie.findByIdAndUpdate(record._id, record, { new: true })
    .then(updatedMovie => {
        if (updatedMovie) {
            res.status(200).send("Movie record updated successfully!");
        } else {
            res.status(500).send("Record does not exist!");
        }
    })
    .catch(error => {
        console.error('Error updating movie:', error);
    });
});


/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Delete Movie
 *     description: Delete a specific movie by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the movie to delete.
 *     responses:
 *       200:
 *         description: Movie deleted successfully.
 *       500:
 *         description: Internal server error.
 */

//deleting the movie with mentioned id
app.delete('/api/movies/:id', authenticateUser, function (req, res) {
    console.log(req.params.id);
    let id = req.params.id;


    Movie.deleteOne({ _id: id })
        .then(result => {
            res.status(200).send("Record deleted successfully");
        })
        .catch(error => {
            //console.error("Error deleting record:", error);
            res.status(500).send('Record does not exist in the databse!');
        });

});

function authenticateUser(req, res, next) {

    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        // Split the header at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];

        try {
            var token = jwt.verify(bearerToken, SecretKey);
        }
        catch (err) {
            console.log(err.message);
            res.status(401).send('Authorization failed, you can not perform this operation!');
            return;
        }
        console.log(token);
        console.log(currentUser);
        if (currentUser && currentUser.username == token.username && currentUser.password == token.password)
            next();
        else
            res.status(401).send('Authorization failed, you can not perform this operation!');
    }
    else
        res.status(500).send();
}


/**
 * @swagger
 * /*:
 *   get:
 *     summary: Error - Page Not Found (if any routes does not match.)
 *     description: Return an error message for invalid API routes.
 *     responses:
 *       404:
 *         description: Page does not exist.
 */

 app.use('*',function(req, res){
     res.status(404).render('error',{message:"Page does nor exist :("})
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