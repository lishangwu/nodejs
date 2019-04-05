const http = require('http')

class LikeExpress {
    constructor(){
        this.routes = {
            all: [],
            get: [],
            post: []
        }
    }

    register(args){
        const info = {}
        if(typeof args[0] === 'string'){
            info.path = args[0]
            info.stack = [].slice.call(args, 1)
        }else{
            info.path = '/'
            info.stack = [].slice.call(args, 0)
        }
        return info
    }

    use () {
        this.routes.all.push(this.register(arguments))
    }
    get () {
        this.routes.get.push(this.register(arguments))
    }
    post () {
        this.routes.post.push(this.register(arguments))
    }

    match(method, url){
        let stack = []
        if(url === 'favicon.ico'){
            return stack
        }
        let curRoutes = []
        curRoutes = curRoutes.concat(this.routes.all)
        curRoutes = curRoutes.concat(this.routes[method])
        curRoutes.forEach(function(routeInfo){
            if(url.indexOf(routeInfo.path) === 0){
                stack = stack.concat(routeInfo.stack)
            }
        })

        return stack
    }

    handle(req, res, stack){
        const next = function(){
            const middleware = stack.shift()
            if(middleware){
                middleware(req, res, next)
            }
        }
        next()
    }

    callback(){
        return (req,res) => {
            res.json = function(data){
                res.setHeader('Content-type', 'application/json')
                res.end(JSON.stringify(data))
            }
            const url = req.url;
            const method = req.method.toLowerCase();
            console.log(url, method);
            //从this.routes 查找 匹配 url 的路由

            this.handle(req, res, this.match(method, url))
            
        }
    }

    listen(...args){
        http.createServer(this.callback()).listen(...args)
    }
}

module.exports = function(){
    return new LikeExpress()
}