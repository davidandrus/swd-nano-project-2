import getCurrentPosition from './geolocation';
import Map from './map';
import Vue from 'vue';
import API from './api';

// contest

// @TOOD - add directions from searches https://maps.googleapis.com/maps/api/directions/json?origin=Lynnwood Transit Center&destination=2200 Western Ave. Seattle, WA&key=AIzaSyDNOfSkNVWM83D3UmZDQjqHQK7PpRG3G_k&mode=transit

let GM;
let directionsService;

// @TOOD - show message if service worker is not supported
// if ('serviceWorker' in navigator) {
//   //@TODO - static/ is for dev only
//   navigator.serviceWorker.register('/static/sw.bundle.js');
// }
//
// const applyOptions = instance => options => instance.options.push.apply(instance.options, options);

// const agencies = new Vue({
//   el: '#agencies-list',
//   created() {
//     API.getAgencyOptions()
//       .then(applyOptions(this));
//     //this.$el.value = '1'; // default to KC Metro
//   },
//   data: {
//     options: [{
//       label: 'Select an Agency',
//       value: ''
//     }],
//   },
//   methods: {
//     handleChange(event) {
//       routes.loadRoutes(event.target.value);
//     }
//   }
// });
//
// const routeDefaultOptions = [{
//   name: 'Select a Route',
//   id: ''
// }];
//
// const routes = new Vue({
//   el: '#routes-list',
//   methods: {
//     loadRoutes(id) {
//       API
//         .getRoutesOptions(id)
//         .then(items => {
//           this.options = items
//         })
//     }
//   },
//   data: {
//     options: []
//   }
// });

getCurrentPosition().then(Map.setMyPosition);


// Promise.all([getCurrentPosition(), getMap()]).then(([geo, map]) => {
//
//   GM = google.maps;
//   directionsService = new google.maps.DirectionsService;
//
//   /**
//    *  @TODO - this should be generated from one bus away
//    *  http://api.pugetsound.onebusaway.org/api/where/agencies-with-coverage.xml?key=TEST
//    */
//   const coverageBounds = new GM.LatLngBounds(
//     new GM.LatLng(47.145437, -122.615662),
//     new GM.LatLng(48.876119, -122.167969)
//   );
//
//   const { lat, lng } = geo;
//   const loc = { lat, lng };
//
//   //@TODO may want to abstract into just a class instead of calling maps api directly
//   map.setCenter(loc);
//
//   const addressOptions = {
//     types: ['geocode'],
//     bounds: coverageBounds,
//   };
//
//   var startAddress = new GM.places.Autocomplete(
//     document.getElementById('start-address'),
//     addressOptions
//   );
//
//   var endAddress = new GM.places.Autocomplete(
//     document.getElementById('end-address'),
//     addressOptions
//   );
//
//   const markers = {
//     start: null,
//     end: null,
//   };
//
//   // @TODO - refactor comon parts into a helper function
//   function getMarkerFn(end) {
//     const markerKey = end === 'start' ? 'start' : 'end';
//     const label = end === 'start' ? 'S' : 'E';
//
//     return function setMarker() {
//       const place = this.getPlace();
//       if (!place || !place.geometry) return;
//
//       const location = place.geometry.location;
//       const lat = location.lat();
//       const lng = location.lng();
//       const newCoords = { lat, lng };
//
//       if (!markers[markerKey]) {
//         markers[markerKey] = new GM.Marker({
//           map,
//           label,
//           position: newCoords,
//         });
//       }
//
//       markers[markerKey].setPosition(newCoords);
//       map.panTo(newCoords);
//       if (markers['start'] && markers['end']) {
//         var bounds = new google.maps.LatLngBounds();
//         Object.keys(markers).forEach(key => bounds.extend(markers[key].getPosition()))
//         map.fitBounds(bounds);
//
//         console.log(markers);
//
//         // @TODO - make this into a promise
//         directionsService.route({
//           origin: markers.start.getPosition(),
//           destination: markers.end.getPosition(),
//           travelMode: 'TRANSIT',
//         }, function(response, status) {
//           if (status === 'OK') {
//             console.log(response.routes[0].legs[0].steps)
//           }
//
//         }, function() {
//           console.log('it did not work yo');
//         });
//         //
//
//       }
//     }
//   }
//
//   startAddress.addListener('place_changed', getMarkerFn('start'));
//   endAddress.addListener('place_changed', getMarkerFn('end'));
// });
