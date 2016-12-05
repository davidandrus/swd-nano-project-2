let resolveFn;
let GM;

export const mapsReady = new Promise((resolve, reject) => {
  resolveFn = resolve;
});

window.initMap = function() {
  GM = google.maps;
  resolveFn();
}

class Map {

  init(elem) {
    this._map = new GM.Map(elem, {
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
  }

  setBusStops(stops, clickListener) {
    const map = this._map;
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
  }

  setMyPosition(loc) {
    const map = this._map;
    const marker = new GM.Marker({
      map,
      position: loc,
      title: 'Me'
    });

    map.setCenter(loc);
  }
}

export default new Map();
