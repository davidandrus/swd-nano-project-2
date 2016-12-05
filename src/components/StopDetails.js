import Vue from 'vue';
import API from '../Api';
import moment from 'moment';

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
        <h1>Schedule for {{ schedules.currentTime | formatDate }}</h1>
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
      return moment(value).format('HH:MMa');
    },
    formatDate(value) {
      return moment(value).format('MM/DD/YYYY');
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
    }
  },
  created() {
    /// console.log('get details', console.log);
    const id = this.$route.params.id;
    const detailsPromise = API.getStopDetails(id);
    const schedulePromise = API.getScheduleForStop(id);

    detailsPromise.then(result => {
      this.stop = result;
    });

    schedulePromise.then(result => {
      this.schedules = result;
      console.log(result);
    });

    Promise.all([ detailsPromise, schedulePromise ]).then(() => {
      this.loading = false;
    });
  }
})

export default component;
