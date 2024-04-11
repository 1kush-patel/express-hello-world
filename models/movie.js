const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  plot: String,
  genres: [String],
  runtime: Number,
  cast: [String],
  poster: String,
  title: String,
  fullplot: String,
  languages: [String],
  released: Date,
  directors: [String],
  rated: String,
  awards: mongoose.Schema.Types.Mixed,
  lastupdated: Date,
  year: Number,
  imdb: mongoose.Schema.Types.Mixed,
  countries: [String],
  type: String,
  tomatoes: mongoose.Schema.Types.Mixed,
  num_mflix_comments: Number
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
