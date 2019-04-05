const http = require('http')

class Express{

    constructor(){
        this.routes = {
            all: [],
            get: [],
            post: []
        }
    }

    register(path){
        let info = {}
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
        this.routes.all.push(this.register.apply(this, arguments))
    }
    get(){
        this.routes.get.push(this.register.apply(this, arguments))
    }
    post(){
        this.routes.post.push(this.register.apply(this, arguments))
    }

    match(method, url){
        console.log(method, url);
        let stack = []
        if(url === '/favicon.ico'){
            return stack
        }

        // this.routes.all.concat(this.routes[method]).forEach(routeInfo => {
        //     if(url.indexOf(routeInfo.path) === 0){
        //         stack = stack.concat(routeInfo.stack)
        //     }
        // })

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
        const next = () => {
            const mid = stack.shift()
            if(mid){
                mid(req, res, next)
            }
        }
        next()
    }

    callback(){
        return (req, res) => {
            res.json = (data) => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
            }

            this.handle(req,res, this.match(req.method.toLowerCase(), req.url))
        }
    }

    listen(...args){
        http.createServer(this.callback()).listen(...args)
    }
}

module.exports = ()=>{
    return new Express()
}