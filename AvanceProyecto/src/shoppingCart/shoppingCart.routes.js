import express from 'express'
import { addCart,
         getCarts,
         updateCart,
         deleteCart,
         buyCart
} from './shoppingCart.controller.js'
import { validateJwt, isClient } from '../../middlewares/validate.jwt.js'

const api = express.Router()

api.post('/addCart', [validateJwt, isClient], addCart)
api.get('/getCarts',[validateJwt, isClient], getCarts )
api.put('/updateCart/:id', [validateJwt, isClient], updateCart)
api.delete('/deleteCart/:id', [validateJwt, isClient], deleteCart)
api.post('/buyCart', [validateJwt, isClient], buyCart) 

export default api