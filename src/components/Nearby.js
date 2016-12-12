import Vue from 'vue';
import getCurrentPosition from '../geolocation';
import Map, { mapsReady } from '../map';
import API from '../Api';
import router from '../router';
import template from './Nearby.template.html';

const component = Vue.component('nearby', {
  template,
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
