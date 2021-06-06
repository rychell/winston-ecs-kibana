const winston = require('winston')
const ecsFormat = require('@elastic/ecs-winston-format')

const express = require('express')

const logger = winston.createLogger({
    level: 'info',
    format: ecsFormat({ convertReqRes: true }), 
    transports:[
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'combined.log' }),
    ]
})

logger.info("Starting server")

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    logger.info("Home  GET access", {req, res})
    return res.json({status: 200})
})
app.post("/", (req, res) => {
    const { id } = req.body
    try {
        if(id > 10){
            const response = {status: 200, id}
            logger.info("Home POST access", {req, res})
            return res.json(response)
        }
        else{
            throw new Error("Error. Id too low")
        }
    } catch (error) {
        logger.info("Home POST access", {req, res, err: error})
        return res.json({status: 200})
    }
})

app.listen(3333, ()=>{
    logger.info("Server is running on port 3333")
})