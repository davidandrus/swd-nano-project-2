import Vue from 'vue';
import getCurrentPosition from '../geolocation';
import Map, { mapsReady } from '../map';
import API from '../Api';
import router from '../router';

const component = Vue.component('nearby', {
  template: `
    <div>
      <div
        id="nearby-map"
        style="height: 500px; width: 500px"
      >
      </div>
    </div>
  `,
  mounted() {
    const onStopClick = id => router.push(`stop/${id}`)
    const mapElem = this.$el.querySelector('#nearby-map');
    const posPromise = getCurrentPosition();

    mapsReady.then(() => {
      Map.init(mapElem);

      posPromise.then(loc => Map.setMyPosition(loc));
      posPromise
        .then(loc => API.getStopsForLocation(loc))
        .then(stops => Map.setBusStops(stops, onStopClick));
    });
  }
})

export default component;
