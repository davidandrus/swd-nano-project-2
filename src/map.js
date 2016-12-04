let resolveFn;
let map;
let GM;

const mapReady = new Promise((resolve, reject) => {
  resolveFn = resolve;
});

window.initMap = function() {
  GM = google.maps;

  map = new GM.Map(document.getElementById('map'), {
    // should be center of coverage area here,
   center: { lat: -34.397, lng: 150.644 },
   zoom: 16,
   styles: [{
     featureType: "transit",
     stylers: [{
       visibility: "off"
     }],
   }],
  });
  resolveFn(map);
}

class Map {
  setBusStops(stops, clickListener) {
    mapReady.then(map => {
      stops.forEach(({ lat, lon, name, id }) => {
        const position = {
          lat,
          lng: lon
        };
        const marker = new GM.Marker({
          map,
          position,
          animation: GM.Animation.DROP,
          //label: name,
          title: name,
        });

        marker.addListener('click', () => {
          map.setCenter(marker.getPosition());
          // set active stop icon

          clickListener(id);
        });
      });
    });
  }

  setMyPosition(loc) {
    mapReady.then(map => {
      const marker = new GM.Marker({
        map,
        position: loc,
        title: 'Me'
      });

      map.setCenter(loc);
    });
  }
}

export default new Map();
