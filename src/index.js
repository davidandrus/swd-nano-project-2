import getCurrentPosition from './geolocation';
import getMap from './map';

Promise.all([getCurrentPosition(), getMap()]).then(([geo, map]) => {
  const { lat, lng } = geo;
  map.setCenter({ lat, lng });
});
