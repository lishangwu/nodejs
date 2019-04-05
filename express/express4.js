
const http = require('http')
class Express{
    constructor() {
        this.routes = {
            all:[],get:[],post:[]
        }
    }

    register(path){
        const info = {}
        if(typeof path === 'string'){
            info.path = path
            info.stack = Array.prototype.slice.call(arguments, 1)
        }else{
            info.path = '/'
            info.stack = Array.prototype.slice.call(arguments, 0)
        }
        return info
    }

    use(){
        this.routes.all.push(this.register.apply(this,arguments))
    }
    get(){
        this.routes.get.push(this.register.apply(this,arguments))
    }
    post(){
        this.routes.post.push(this.register.apply(this,arguments))
    }

    match(method, url){
        let stack = []
        if(url === '/favico.ico'){
            return []
        }
        this.routes.all.forEach(routeInfo => {
            if(url.indexOf(routeInfo.path) === 0){
                stack = stack.concat(routeInfo.stack)
            }
        })
        this.routes[method].forEach(routeInfo => {
            if(url === routeInfo.path){
                stack = stack.concat(routeInfo.stack)
            }
        })
        return stack
    }

    handle(req, res, stack){
        function next(){
            const middleware = stack.shift()
            if(middleware){
                middleware(req, res, next)
            }
        }
        next()
    }
    callback(req, res){
        return (req, res) => {
            res.json = (data)=>{
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
            }
            const url = req.url
            const method = req.method.toLowerCase()
            const routes = this.match(method, url)
            this.handle(req, res, routes)

        }
    }
    listen(...args){
        http.createServer(this.callback()).listen(...args)
    }

    
}

module.exports = function(){
    return new Express()
}