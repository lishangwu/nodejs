const http = require('http')

function compose(middlewares){
    return ctx => {
        function dispatch(i){
            const fn = middlewares[i]
            try{
                return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))
            }catch(err){
                return Promise.reject(err)
            }
        }
        return dispatch(0)
    }
}

class Koa{

    constructor(){
        this.middlewares = []
    }

    use(fn){
        if(typeof fn !== 'function') throw new Error('fn is not function')
        this.middlewares.push(fn)
        return this
    }
    createContext(req, res){
        const ctx = {req, res}
        ctx.query = req.query
        return ctx
    }
    handleRequest(ctx, fn){
        return fn(ctx)
    }
    callback(){

        const fn = compose(this.middlewares)
        return (req, res) => {
            const ctx = this.createContext(req, res)
            this.handleRequest(ctx, fn)
        }
    }

    listen(...args){
        http.createServer(this.callback()).listen(...args)
    }

}

module.exports = Koa