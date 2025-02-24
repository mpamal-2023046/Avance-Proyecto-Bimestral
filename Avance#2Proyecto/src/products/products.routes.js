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
import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

api.post('/addP', [validateJwt], addProduct)
api.get('/getAllP', getAllProducts)
api.get('/getSOP', [validateJwt], getSoldOutProducts)
api.get('/getTopSP', [validateJwt], getTopSellingProducts)
api.put('/sell/:id', [validateJwt], sellProduct)
api.get('/getP/:id', [validateJwt], getProduct)
api.put('/updateP/:id', [validateJwt], updateProduct)
api.delete('/deleteP/:id',[validateJwt], deleteProduct)

export default api