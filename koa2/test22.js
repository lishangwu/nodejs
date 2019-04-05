const Koa = require('./like-koa22');
const app = new Koa();

// logger
app.use(async (ctx, next) => {
    console.log('1');
  await next();
  const rt = ctx['X-Response-Time'];
  console.log(`${ctx.req.method} ${ctx.req.url} - ${rt}`);
  console.log('1..');
});

// x-response-time
app.use(async (ctx, next) => {
    console.log('2');
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx['X-Response-Time'] = `${ms}ms`;
  console.log('2..');
});

// response
app.use(async ctx => {
    console.log('3');
  ctx.res.end('This is like koa2');
  console.log('3..');
});

app.listen(3000);