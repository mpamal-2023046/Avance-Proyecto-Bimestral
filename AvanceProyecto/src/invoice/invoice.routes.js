import { Router } from "express"
import { getAllInvoices,
         getInvoicesByCustomer,
         getInvoiceById,
         updateInvoice
} from './invoice.controller.js' 
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js'

const api = Router()


api.get('/getAllI', getAllInvoices)
api.get('/getIBC/:id', getInvoicesByCustomer)
api.get('/getIBI/:id', getInvoiceById)
api.put('/updateI/:id', [validateJwt, isAdmin], updateInvoice)


export default api