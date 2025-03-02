'use strict'

//ECModules | ESModules
import express from 'express' //Servidor HTTP
import morgan from 'morgan' //Logs
import helmet from 'helmet' //Seguridad para HTTP
import cors from 'cors' //Acceso al API
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/user/user.routes.js'
import productRoutes from '../src/products/products.routes.js'
import categoryRoutes from '../src/category/category.routes.js'
import invoiceRoutes from '../src/invoice/invoice.routes.js'
import shoppingCartRoutes from '../src/shoppingCart/shoppingCart.routes.js'
import { limiter } from '../middlewares/rate.limit.js'

//Configuraciones de express
const configs = (app)=>{
    app.use(express.json()) //Aceptar y enviar datos en JSON
    app.use(express.urlencoded({extended: false})) //No encriptar la URL
    app.use(cors())
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(limiter) //valida las solicitudes en x tiempo
}

const routes = (app)=>{
    app.use(authRoutes)
    //Version del API y entidad
    app.use('/v1/user', userRoutes)
    app.use('/v1/product', productRoutes)
    app.use('/v1/category', categoryRoutes)
    app.use('/v1/invoice', invoiceRoutes)
    app.use('/v1/cart', shoppingCartRoutes)
}

//Ejecutarmos el servidor
export const initServer = ()=>{
    const app = express() //Instancia de express
    try{
        configs(app)
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port ${process.env.PORT}`)
    }catch(err){
        console.error('Server init failed', err)
    }
}