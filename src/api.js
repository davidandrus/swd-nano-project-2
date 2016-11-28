// @TODO - should be different depending on environment
const baseURL = 'http://localhost:3000';

function mapOptions(labelProp = 'name', valueProp = 'id') {
  return item => ({
    label: item[labelProp],
    value: item[valueProp],
  });
}

export default {
  _fetch(endpoint) {
    return fetch(`${baseURL}/${endpoint}`).then(response => response.json());
  },

  getRoutesOptions(id) {
    return this._fetch(`routes_for_agency/${id}`)
      .then(response =>  response.data.list.map(mapOptions('shortName', 'id')));
  },

  getAgencyOptions() {
    return this._fetch('agencies')
      .then(response => response.data.references.agencies.map(mapOptions()))
  }
}
