const http = require('http')

function compose(middlewares){
    return function(ctx){
        function dispatch(i){
            const fn = middlewares[i]
            try{
                return Promise.resolve(fn(ctx, dispatch.bind(null, i+1)))
            }catch(err){
                return Promise.reject(err)
            }
        }
        dispatch(0)
    }
}
class Koa2{
    constructor(){
        this.middlewares = []
    }

    use(fn){
        this.middlewares.push(fn)
        return this
    }

    createContext(req, res){
        const ctx  = {req, res}
        ctx.query = req.query
        return ctx
    }

    handleRequest(ctx, fn){
        fn(ctx)
    }

    callback(){
        const fn = compose(this.middlewares)
        return (req, res) => {
            const ctx = this.createContext(req,res)
            this.handleRequest(ctx, fn)
        }
    }
    listen(...args){
        http.createServer(this.callback()).listen(...args)
    }
}

module.exports = Koa2