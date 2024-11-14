import express from 'express'
import cors from 'cors'
import http from 'http'
import cookieParser from 'cookie-parser'
import userRoute from '../routes/userRoutes'
import providerRoute from '../routes/providerRoutes'
import adminRoute from '../routes/adminRoutes'
import chatRoute from '../routes/chatRoutes'
import bookingRoute from '../routes/bookingRoutes'
import socketServer from './socketServer'

export const createServer = () => {

    try {
        const app = express()
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(cookieParser())
        app.use(
            cors({
                origin: ['http://localhost:5173'],
                methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
                credentials: true,
                optionsSuccessStatus: 200
            })
        )
        
        app.use('/api/user',userRoute)
        app.use('/api/provider', providerRoute)
        app.use('/api/admin', adminRoute)
        app.use('/api/chat', chatRoute)
        app.use('/api/book', bookingRoute)

        const server = http.createServer(app)
        socketServer(server)


        return server

    } catch (error) {
        console.log(error);
    }
}