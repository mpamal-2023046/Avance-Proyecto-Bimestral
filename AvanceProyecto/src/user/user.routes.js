import { Router } from "express";
import { getAllUser,
         getUser,
         updateUser,
         deleteUser,
         getPurchaseHistory
 } from "./user.controller.js"
import{ getTopSellingProducts, getProduct, getAllProducts } from '../../src/products/products.controller.js'
import { getAllCategories } from "../category/category.controller.js"; 
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { updateUserValidator } from "../../middlewares/validators.js"


const api = Router()

//Rutas privadas (Solo se puede acceder si esta logeado)
api.get('/getAllU', getAllUser)
api.get('/getU/:id', [validateJwt], getUser)
api.put('/updateU/:id', [validateJwt, updateUserValidator], updateUser)
api.delete('/deleteU/:id',[validateJwt], deleteUser)
api.get('/getTopSP', [validateJwt], getTopSellingProducts)
api.get('/getP/:id?', [validateJwt], getProduct)
api.get('/getAllC', [validateJwt], getAllCategories)
api.get('/getAllP', getAllProducts)
api.get('/getHistory/:id', [validateJwt], getPurchaseHistory)
export default api