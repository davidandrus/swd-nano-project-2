import Koa from 'koa';
import KoaRouter from 'koa-router';
import cors from 'kcors';
import fetch from 'isomorphic-fetch';
import qs from 'query-string';
import { one_bus_away as OBA_KEY } from '../keys.json';

const OBA_BASE_PATH = 'http://api.pugetsound.onebusaway.org/api';
const getRequestUrl = (path, params) => {
  const queryString = qs.stringify({
    ...params,
    key: OBA_KEY,
  });
  return `${OBA_BASE_PATH}/${path}.json?${queryString}`;
}

const router = KoaRouter();

var app = new Koa();

router.get('/agencies', async (ctx, next) => {
  const JSON = await fetch(getRequestUrl('where/agencies-with-coverage'))
    // need to handle errors
    .then(response => response.json())

  ctx.body = JSON;


  //console.log(response);

  //ctx.body = response;
});

// app.use(async (ctx, next) => {
//   ctx.body = "Hello World";
// });
app
  .use(cors())
  .use(router.routes());

app.listen(3000);
