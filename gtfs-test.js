var gtfs = require('gtfs');

// this is gross, but it works
const mongoose = require('./node_modules/gtfs/node_modules/mongoose');

mongoose.connect('mongodb://localhost:27017/gtfs');
// gtfs.agencies((err, agencies) => {
//   console.log(agencies);
// }, mongoose);

gtfs.getStopsByRoute('KCM', '100011', '0', (err, stops) => {
  console.log(stops.filter(stop => stop.stop_name.toUpperCase().indexOf('HOWELL') > -1));
});
