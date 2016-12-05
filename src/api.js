import qs from 'query-string';

// @TODO - should be different depending on environment
const baseURL = 'http://localhost:3000';

function mapOptionsFactory(labelProp = 'name', valueProp = 'id') {
  return item => ({
    label: typeof labelProp === 'function' ? labelProp(item): item[labelProp],
    value: item[valueProp],
  });
}

function routeLabelGetter({ shortName, longName }) {
  return shortName && longName
    ? `${shortName} - ${longName}`
    : shortName || longName;
}

class API {
  _fetch(endpoint, params = {}) {
    const queryString = Object.keys(params).length ? `?${qs.stringify(params)}` : '';
    return fetch(`${baseURL}/${endpoint}${queryString}`).then(response => response.json());
  }

  getStopsForLocation(pos) {
    return this._fetch('stops_for_location', pos);
  }

  getStopDetails(id) {
    return this._fetch('stop_details', { id });
  }

  getScheduleForStop(id) {
    return this._fetch('stop_schedule', { id });
  }

  getAgencies() {
    return this._fetch('agencies');
  }

  // getRoutesOptions(id) {
  //   return this._fetch(`routes_for_agency/${id}`)
  //     .then(response =>  response.data.list.map(mapOptionsFactory(routeLabelGetter, 'id')));
  // },
  //
  // getAgencyOptions() {
  //   return this._fetch('agencies')
  //     .then(response => response.data.references.agencies.map(mapOptionsFactory()))
  // },
  //
  // getStopsforRoute() {
  //   //return this._fetch('')
  // }
}

export default new API();
