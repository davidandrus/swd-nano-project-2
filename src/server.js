import Koa from 'koa';
import KoaRouter from 'koa-router';
import cors from 'kcors';
import fetch from 'isomorphic-fetch';
import qs from 'query-string';
import { one_bus_away as OBA_KEY } from '../keys.json';
import gtfs from 'gtfs';

// @TODO - add error handling

/**
 *  @TODO possibly we could acheive this with a babel-module-resolver
 *  this is kind of gross but we need to insure that one instance is used of mongo,
 */
import mongoose from '../node_modules/gtfs/node_modules/mongoose';
mongoose.Promise = global.Promise;

// should get mongo route from config or something
mongoose.connect('mongodb://localhost:27017/GTFS');

const OBA_BASE_PATH = 'http://api.pugetsound.onebusaway.org/api';
const getRequestUrl = (path, params) => {
  const queryString = qs.stringify({
    ...params,
    key: OBA_KEY,
  });
  return `${OBA_BASE_PATH}/${path}.json?${queryString}`;
}

const makeRequest = (endpoint, params) => {
  const url = getRequestUrl(endpoint, params);
  console.log('making', url);
  return fetch(url)
    .then(response => response.json());
};

const getRouteDetails = (routes, agencies, routeIdToMatch) => {
  return routes
    .filter(route => routeIdToMatch === route.id)
    .map(({ shortName, longName, agencyId }) => ({
      shortName,
      longName,
      agencyName: agencies.filter(agency => agency.id === agencyId)[0].name,
    }))[0]
}

const router = KoaRouter();

var app = new Koa();

// @NOTE - this endpoints currently only return the most limited data the front end needs
router
  .get('/agencies', async (ctx, next) => {

    const {
      data: {
        references: {
          agencies,
        },
        list,
      },
    } = await makeRequest('where/agencies-with-coverage');

    ctx.body = agencies.map(({ id, name, url }) => ({
      id,
      name,
      url,
      coverageArea: list.filter(coverage => coverage.agencyId === id)[0],
    }));
  })

  .get('/stops_for_location', async (ctx, next) => {
    const {
      lat,
      lng,
    } = ctx.request.query;

    const params = {
      lat,
      lon: lng,
    };

    const response =  await makeRequest('where/stops-for-location', params);

    ctx.body = response.data.list.map(({code, locationType, wheelchairBoarding, ...rest}) => ({
      ...rest,
    }));
  })

  .get('/stop_details', async (ctx, next) => {
    const { id } = ctx.request.query;
    const {
      data: {
        entry: {
          name,
          direction,
        },
        references: {
          routes,
        },
      },
    } = await makeRequest(`where/stop/${id}`);

    ctx.body = {
      name,
      direction,
      routes: routes.map(({ longName, shortName, agencyId, id }) => ({
        id,
        agencyId,
        longName,
        shortName,
      })),
    }
  })

  .get('/stop_schedule', async (ctx, next) => {
    const { id, date: requestDate } = ctx.request.query;
    const {
      currentTime,
      data: {
        entry: {
          date,
          stopRouteSchedules,
        },
        references: {
          agencies,
          routes,
        },
      },
    } = await makeRequest(`where/schedule-for-stop/${id}`, { date });

    ctx.body = stopRouteSchedules.map(({ routeId, stopRouteDirectionSchedules }) => ({
      currentTime,
      route: getRouteDetails(routes, agencies, routeId),
      schedule: stopRouteDirectionSchedules
        .map(({ tripHeadsign, scheduleStopTimes }) => ({
          headSign: tripHeadsign,
          times: scheduleStopTimes
            .map(({ departureTime, tripId, serviceId }) => ({
              departureTime,
              serviceId,
              tripId,
            }))
      }))
    }));
  })

  .get('/departures_for_stop', async (ctx, next) => {
    const { id } = ctx.request.query;
    const response = await makeRequest(`where/arrivals-and-departures-for-stop/${id}`);
    const {
      currentTime,
      data: {
        entry: {
          arrivalsAndDepartures,
        },
        references: {
          routes,
          agencies,
          trips,
        },
      },
    } = response;

    console.log(response);

    ctx.body = {
      currentTime,
      list: arrivalsAndDepartures
        .map(({
          scheduledDepartureTime,
          tripStatus: {
            scheduleDeviation,
          },
          routeId,
          tripId,
        }) => ({
          deviation: scheduleDeviation,
          departureTime:  scheduledDepartureTime,
          route: getRouteDetails(routes, agencies, routeId),
          headSign: trips.filter(trip => trip.id === tripId)[0].tripHeadsign
        })),
    };
  })

app
  //@TODO - setup cors whitelist
  .use(cors())
  .use(router.routes());

app.listen(3000);
