import Vue from 'vue';
import API from '../Api';
import moment from 'moment';
import template from './StopDetails.template.html';

let pollTimeout;
const msAsMinutes = time => Math.round(moment.duration(time, 'milliseconds').asMinutes());

const component = Vue.component('stopDetails', {
  template,
  filters: {
    formatTime(value) {
      return moment(value).format('h:MM a');
    },
    formatDate(value) {
      return moment(value).format('MM/DD/YYYY');
    },
    formatExpectedTime(value) {
      const time = msAsMinutes(value);
      if (time > 0) {
        if (time < 1) {
          return 'arriving now';
        }
        return `arriving in ${Math.abs(time)} minutes`;
      }

      if (time <= 0) {
        if (time > -1) {
          return 'just left';
        }
        return `left ${Math.abs(time)} minutes ago`
      }
    },
    formatDeviation(value) {
      if (value === 0) {
        return 'on time';
      }
      if (value > 0) {
        return `${msAsMinutes(value)} early`;
      }
      if (value < 0) {
        return `${msAsMinutes(value)} late`;
      }
    },
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
      schedules: {},
      departures: {
        list: [],
      },
    }
  },
  destroyed() {
    clearTimeout(pollTimeout);
  },
  created() {
    /// console.log('get details', console.log);
    const id = this.$route.params.id;
    const detailsPromise = API.getStopDetails(id);
    const schedulePromise = API.getScheduleForStop(id);
    const updateDepartures = () => API.getExpectedDeparturesForStop(id)
      .then(result => this.departures = result);
    const departuresPromise = updateDepartures();

    detailsPromise.then(result => {
      this.stop = result;
    });

    schedulePromise.then(result => {
      this.schedules = result;
    });

    Promise.all([ detailsPromise, schedulePromise ]).then(() => {
      this.loading = false;
    });
  }
})

export default component;
