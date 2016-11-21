const geolocationObject = navigator.geolocation;
const supportsGeolocation = !!geolocationObject;

export default function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (supportsGeolocation) {
      geolocationObject.getCurrentPosition(({
        coords: { latitude, longitude}
      }) => {
        resolve({
          lat: latitude,
          lng: longitude,
        });
      }, e => reject(e));
    } else {
      reject('Your browser does not support Geolocation');
    }
  });
};
