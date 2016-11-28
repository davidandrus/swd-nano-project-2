import Koa from 'koa';
import KoaRouter from 'koa-router';
import cors from 'kcors';
import fetch from 'isomorphic-fetch';
import qs from 'query-string';
import { one_bus_away as OBA_KEY } from '../keys.json';

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
  });

// app.use(async (ctx, next) => {
//   ctx.body = "Hello World";
// });
app
  .use(cors())
  .use(router.routes());

app.listen(3000);
