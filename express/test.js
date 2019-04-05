// const express = require('./like-express')
const express = require('./express4')

// const express = require('express')

const app = express()

app.use((req, res, next) => {
    console.log('1   start .. ', req.method, req.url);
    next()
    console.log('1..   start .. ', req.method, req.url);

})

app.use((req, res, next) => {
    console.log('2   cookie .. ', req.method, req.url);
    req.cookie = { userId : 'abc123' }
    next()
    console.log('2..   cookie .. ', req.method, req.url);
})

app.use('/api', (req, res, next)=>{
    console.log('3   /api .....');
    next()
    console.log('3..   /api .....');

})

app.get('/api', (req, res, next)=>{
    console.log('4   get /api .....');
    next()
    console.log('4..   get /api .....');

})

function loginCheck(req, res, next){
    setTimeout(()=>{
        console.log('5   loginCheck ..');
        next()
        console.log('5..   loginCheck ..');

    })
}

app.get('/api/get-cookie', loginCheck, (req, res, next)=>{
    console.log('6   get /api .....');
    res.json({
        errno: 0,
        data: req.cookie
    })
    console.log('6..   get /api .....');

})

app.listen(3000, ()=>{
    console.log('server is running on port 3000');
})