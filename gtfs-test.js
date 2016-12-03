var gtfs = require('gtfs');

// this is gross, but it works
const mongoose = require('./node_modules/gtfs/node_modules/mongoose');

mongoose.connect('mongodb://localhost:27017/gtfs');
gtfs.agencies((err, agencies) => {
  console.log(agencies);
}, mongoose);
