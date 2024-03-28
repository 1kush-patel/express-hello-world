/******************************************************************************
***
* ITE5315 – Assignment 4
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: Kush Nileshbhai Patel Student ID: N01579863 Date: 28-3-24
*
*
******************************************************************************
**/
// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
PrdSchema = new Schema({
  asin: String,
  title: String,
  imgUrl: String,
  stars: Number,
  reviews: Number,
  price: Number,
  listPrice: Number,
  categoryName: String,
  boughtInLastMonth: Number
});
module.exports = mongoose.model('Product', PrdSchema);