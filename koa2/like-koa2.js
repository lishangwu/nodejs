const http = require('http')

function compose(middlewares){
    return function(ctx){
        const num = middlewares.length
        function dispatch(i){
            if(num === i) return 
            console.log('i: ', i);
            let middleware = middlewares[i]
            try{
                return Promise.resolve(middleware(ctx, dispatch( i+1)))

            }catch(e){
                // return Promise.reject(e)

            }
        }
        dispatch(0)
    }
}

class LikeKoa2{
    constructor(){
        this.middlewares = []
    }

    use(fn){
        this.middlewares.push(fn)
        return this
    }

    createContext(req, res){
        let ctx = {req, res}
        return ctx
    }

    handleRequest(ctx, fn){
        fn(ctx)
    }

    callback(){

        let fn = compose(this.middlewares)

        return (req, res) => {
            let ctx = this.createContext(req ,res)
            this.handleRequest(ctx, fn)
        }
    }

    listen(...args){
        http.createServer(this.callback()).listen(...args)
    }
}

module.exports = LikeKoa2