const mongoose = require('mongoose');
 function initialize(connectionString) {
    return new Promise((resolve, reject) => {
      mongoose.connect(connectionString)
      .then(() => {
        console.log('Connected to MongoDB');
        resolve();
      })
      .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        reject(err);
      });
    });
  }

  module.exports = {
    initialize
  };