// const Koa = require('koa')
const Koa = require('./koa2-1')
const app = new Koa()

app.use(async (ctx, next) => {
    ctx.body = 'koa2 ..'
    console.log('1');
    await next()
    console.log('1 ..');
})

app.use(async (ctx, next) => {
    ctx.body += 'koa2 ..'
    console.log('2');
    await next()
    console.log('2 ..');
})

app.use(async ctx => {
    console.log('3');
    ctx.body += 'sb'
    console.log('3 ..');
})

app.listen(3000)