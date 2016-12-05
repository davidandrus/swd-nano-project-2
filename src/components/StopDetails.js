import Vue from 'vue';
import API from '../Api';

const component = Vue.component('stopDetails', {
  template: `
    <div>
      <h1>Stop Details</h1>
      <h2>{{ stop.name }} - {{ stop.direction | formatDirection }}</h2>
      <ul>
        <li v-for="route in stop.routes">
          {{ route.id }} {{ route.shortName }}
          <small v-if="route.longName">{{ route.longName }}</small>
          >
        </li>
      </ul>
    </div>
  `,
  filters: {
    formatDirection(value) {
      switch(value) {
        case 'W':
          return 'Westbound';
        case 'E':
          return 'Eastbound';
        case 'S':
          return 'Southbound';
        case 'N':
          return 'Northbound';
        default:
          return value;
      }
    },
  },
  data() {
    return {
      loading: true,
      stop: {},
      schedule: {},
    }
  },
  created() {
    /// console.log('get details', console.log);
    const id = this.$route.params.id;
    const detailsPromise = API.getStopDetails(id);
    detailsPromise.then(result => {
      this.stop = result;
    });

    const schedulePromise = API.getScheduleForStop(id).then(console.log);

    Promise.all([ detailsPromise ], () => {
      this.loading = false;
    });


  }
})

export default component;
