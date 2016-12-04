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
  return fetch(url)
    .then(response => response.json());
};

const router = KoaRouter();

var app = new Koa();

// @TODO - make endpoints return minimum amout of data neccessary
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

    ctx.body = agencies.map(({ id, name, url}) => ({
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

    ctx.body = response.data.list;
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
  // .get('/agencies', async (ctx, next) => {
  //
  //   ctx.body = await makeRequest('where/agencies-with-coverage');
  //   next();
  // })
  // .get('/routes_for_agency/:id', async (ctx, next) => {
  //   const { id } = ctx.params;
  //   ctx.body = await makeRequest(`where/routes-for-agency/${id}`);
  //   // console.log(ctx.body);
  //   next();
  // })
  // .get('/stops_for_route/:id', async (ctx, next) => {
  //
  //   gtfs.agencies((err, agencies) => {
  //     ctx.body = 'agencies got yo';
  //     next();
  //   }).then(response => {
  //     ctx.body = response;
  //     next();
  //   });
  //
  //   const { id } = ctx.params;
  //   //ctx.body = 'sucka';
  //   //next();
  // });

// app.use(async (ctx, next) => {
//   ctx.body = "Hello World";
// });
app
  .use(cors())
  .use(router.routes());

app.listen(3000);
