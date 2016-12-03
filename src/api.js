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

export default {
  _fetch(endpoint) {
    return fetch(`${baseURL}/${endpoint}`).then(response => response.json());
  },

  getRoutesOptions(id) {
    return this._fetch(`routes_for_agency/${id}`)
      .then(response =>  response.data.list.map(mapOptionsFactory(routeLabelGetter, 'id')));
  },

  getAgencyOptions() {
    return this._fetch('agencies')
      .then(response => response.data.references.agencies.map(mapOptionsFactory()))
  },

  getStopsforRoute() {
    //return this._fetch('')
  }
}
