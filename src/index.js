const express = require('express')
require('express-async-errors');
const interceptor = require('express-interceptor')
const winston = require('winston')
const ecsFormat = require('@elastic/ecs-winston-format')

const logger = winston.createLogger({
    level: 'info',
    format: ecsFormat({ convertReqRes: true }), 
    transports:[
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'combined.log' }),
    ]
})

logger.info("Starting server")

const loggerInterceptor = interceptor((req, res)=>{
    return {
        isInterceptable: function(){
            return true
        },
        intercept: (body, send) => {
            logger.info("Express", {req, res})
            send(body)
        }
    }
})

const app = express()

app.use(express.json())

app.use(loggerInterceptor)

app.get("/", (req, res) => {
    return res.json({status: 200})
})
app.post("/", (req, res) => {
    const { id } = req.body

    if(id > 10){
        const response = {status: 200, id}
        return res.json(response)
    }
    else{
        throw new Error("Error. Id too low")
    }
})
app.get("/user/:id", (req, res) => {
    const { id } = req.params

    if(id > 10){
        const response = {status: 200, id}
        return res.json(response)
    }
    else{
        throw new Error("Error. Id too low")
    }
})
app.get("*", (req, res) => {
    const response = {status: 404}
    return res.status(404).json(response)
})
app.use((err, req, res, next) => {
    logger.error("Express", {req, res, err})
    res.status(403);
    res.json({ error: err.message });

    return res
});

app.listen(3333, ()=>{
    logger.info("Server is running on port 3333")
})