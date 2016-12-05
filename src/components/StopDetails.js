import Vue from 'vue';
import API from '../Api';
import moment from 'moment';

let pollTimeout;
const msAsMinutes = time => Math.round(moment.duration(time, 'milliseconds').asMinutes());

const component = Vue.component('stopDetails', {
  template: `
    <div>
      <div v-if="loading">Loading</div>
      <div v-if="!loading">
        <h1>Stop Details</h1>
        <h2>{{ stop.name }} - {{ stop.direction | formatDirection }}</h2>
        <ul>
          <li v-for="route in stop.routes">
            {{ route.id }} {{ route.shortName }}
            <small v-if="route.longName">{{ route.longName }}</small>
            >
          </li>
        </ul>
        <div v-if="departures.list.length > 0">
          <h1>Expected / Recent Departures</h1>
          <table >
            <tr>
              <th>Route</th>
              <th>Expected</th>
              <th>Deviation</th>
            </tr>
            <tr v-for="departure in departures.list">
              <td>
                {{ departure.route.agencyName }} {{ departure.route.shortName }}<br />
                <small>{{ departure.route.longName }}</small><br />
                to {{ departure.headSign }}
              </td>
              <td>
                {{ departure.departureTime - departures.currentTime + departure.deviation | formatExpectedTime }}<br />
              </td>
              <td>
                {{ departure.deviation | formatDeviation }}
              </td>
            </tr>
          </table>
        </div>
        <h1>Departure Schedule for {{ schedules.currentTime | formatDate }}</h1>
        <div v-for="routeSchedule in schedules">
          <table v-for="schedule in routeSchedule.schedule">
            <tr>
              <th>
                {{ routeSchedule.route.agencyName }} {{ routeSchedule.route.shortName }}<br />
                <small>{{ routeSchedule.route.longName }}</small><br />
                to {{ schedule.headSign }}
              </th>
            </tr>
            <tr v-for="time in schedule.times">
              <td>{{ time.departureTime | formatTime }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  `,
  filters: {
    formatTime(value) {
      return moment(value).format('h:MM a');
    },
    formatDate(value) {
      return moment(value).format('MM/DD/YYYY');
    },
    formatExpectedTime(value) {
      const time = msAsMinutes(value);
      return time > 0 ? `expected in ${time} minutes` : `left ${Math.abs(time)} minutes ago`
    },
    formatDeviation(value) {
      if (value === 0) {
        return 'on time';
      }
      if (value > 0) {
        return `${msAsMinutes(value)} ahead of schedule`;
      }
      if (value < 0) {
        return `${msAsMinutes(value)} behind of schedule`;
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
  created() {
    /// console.log('get details', console.log);
    const id = this.$route.params.id;
    const detailsPromise = API.getStopDetails(id);
    const schedulePromise = API.getScheduleForStop(id);
    const departuresPromise = API.getExpectedDeparturesForStop(id);

    detailsPromise.then(result => {
      this.stop = result;
    });

    schedulePromise.then(result => {
      this.schedules = result;
    });

    departuresPromise.then(result => {
      this.departures = result;
      console.log(result);
    });

    Promise.all([ detailsPromise, schedulePromise ]).then(() => {
      this.loading = false;
    });
  }
})

export default component;
