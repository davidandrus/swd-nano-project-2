import Koa from 'koa';

var app = new Koa();

app.use(async (ctx, next) => {
  ctx.body = "Hello World";
});

app.listen(3000);
