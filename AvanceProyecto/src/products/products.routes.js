import { Router } from "express"
import { addProduct,
         getAllProducts,
         getSoldOutProducts,
         getTopSellingProducts,
         sellProduct,
         getProduct,
         updateProduct,
         deleteProduct
} from "./products.controller.js"
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

api.post('/addP', [validateJwt, isAdmin], addProduct)
api.get('/getAllP', [validateJwt], getAllProducts)
api.get('/getP/:id?', [validateJwt], getProduct)
api.get('/getSOP', [validateJwt, isAdmin], getSoldOutProducts)
api.get('/getTopSP', [validateJwt], getTopSellingProducts)
api.put('/getSell/:id', [validateJwt, isAdmin], sellProduct)
api.put('/updateP/:id', [validateJwt, isAdmin], updateProduct)
api.delete('/deleteP/:id',[validateJwt, isAdmin], deleteProduct)

export default api