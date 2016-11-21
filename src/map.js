let resolveFn;
let map;

const mapReady = new Promise((resolve, reject) => {
  resolveFn = resolve;
});

window.initMap = function() {
  map = new google.maps.Map(document.getElementById('map'), {
    // should be center of seattle here,
     center: {lat: -34.397, lng: 150.644},
     zoom: 14
   });
  resolveFn(map);
}

export default function getMap() {
  return mapReady;
};
