import dotenv from 'dotenv'
dotenv.config()
import path from 'path'
import express from 'express'
import http from 'node:http'
import cors from 'cors'
import helmet from 'helmet'
import { fileURLToPath } from 'node:url'
import logger from './utils/logger.js'
import clientDirConfig from '../client/dirConfig.js'
import  _memcache  from './utils/memeCached.js'
import pasteRouter from './api/api.paste.js'
import dbConnection from './utils/dbConn.js'
const app = express()
const server = http.createServer(app)

app.get('/',(req,res) => {
    res.sendFile(clientDirConfig + '/index.html')
})


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/health-check',(req,res) => {
    return res.status(200).json('SERVER IS UP AND RUNNING')
})

app.use(express.json({
    limit: "1mb"
  }));
app.use(cors())
app.use(helmet())
app.use(express.static(path.join(__dirname, "../client")));
app.use('/api',pasteRouter)
const PORT = process.env.PORT || 4001
dbConnection()
server.listen(PORT,()=> {
    logger.info(`server is listening on port ${PORT}`)
})
