let resolveFn;
let map;
let GM;

const mapReady = new Promise((resolve, reject) => {
  resolveFn = resolve;
});

window.initMap = function() {
  GM = google.maps;
  map = new GM.Map(document.getElementById('map'), {
    // should be center of seattle here,
     center: {lat: -34.397, lng: 150.644},
     zoom: 14
   });
  resolveFn(map);
}

class Map {
  setBusStops() {
    
  }

  setMyPosition(loc) {
    mapReady.then(map => {
      const marker = new GM.Marker({
        map,
        position: loc,
        title: 'Me'
      }).setMap(map);

      map.setCenter(loc);
    });
  }
}

export default new Map();

//
// export default function getMap() {
//   return mapReady;
// };
