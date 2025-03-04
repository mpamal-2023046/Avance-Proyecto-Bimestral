import { Router } from "express"
import { addCategory,
         getAllCategories,
         updateCategory,
         deleteCategory
} from './category.controller.js'
import { validateJwt, isAdmin} from '../../middlewares/validate.jwt.js'


const api = Router()


api.post('/addC', [validateJwt, isAdmin], addCategory)
api.get('/getAllC', [validateJwt], getAllCategories)
api.put('/updateC/:id', [validateJwt, isAdmin], updateCategory)
api.delete('/deleteC/:id', [validateJwt, isAdmin], deleteCategory)


export default api