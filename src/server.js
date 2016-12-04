import Koa from 'koa';
import KoaRouter from 'koa-router';
import cors from 'kcors';
import fetch from 'isomorphic-fetch';
import qs from 'query-string';
import { one_bus_away as OBA_KEY } from '../keys.json';
import gtfs from 'gtfs';

/**
 *  @TODO possibly we could acheive this with a babel-module-resolver
 *  this is kind of gross but we need to insure that one instance is used of mongo,
 */
import mongoose from './node_modules/gtfs/node_modules/mongoose';
mongoose.Promise = global.Promise;

// should get mongo route from config or something
mongoose.connect('mongodb://localhost:27017/GTFS');

const OBA_BASE_PATH = 'http://api.pugetsound.onebusaway.org/api';
const getRequestUrl = path => {
  const queryString = qs.stringify({
    key: OBA_KEY,
  });
  return `${OBA_BASE_PATH}/${path}.json?${queryString}`;
}

const makeRequest = endpoint => {
  const url = getRequestUrl(endpoint);
  console.log('fetching', url);
  return fetch(url)
    .then(response => response.json());
};

const router = KoaRouter();

var app = new Koa();

// @TODO - make endpoints return minimum amout of data neccessary
router
  .get('/agencies', async (ctx, next) => {

    ctx.body = await makeRequest('where/agencies-with-coverage');
    next();
  })
  .get('/routes_for_agency/:id', async (ctx, next) => {
    const { id } = ctx.params;
    ctx.body = await makeRequest(`where/routes-for-agency/${id}`);
    // console.log(ctx.body);
    next();
  })
  .get('/stops_for_route/:id', async (ctx, next) => {

    gtfs.agencies((err, agencies) => {
      ctx.body = 'agencies got yo';
      next();
    }).then(response => {
      ctx.body = response;
      next();
    });

    const { id } = ctx.params;
    //ctx.body = 'sucka';
    //next();
  });

// app.use(async (ctx, next) => {
//   ctx.body = "Hello World";
// });
app
  .use(cors())
  .use(router.routes());

app.listen(3000);
