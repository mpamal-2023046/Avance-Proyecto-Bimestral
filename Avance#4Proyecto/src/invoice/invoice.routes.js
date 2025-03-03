import { Router } from "express"
import { addInvoice,
         getAllInvoices,
         getInvoicesByCustomer,
         getInvoiceById,
         updateInvoice,
         deleteInvoice
} from './invoice.controller.js' 
import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()


api.post('/creatI', [validateJwt], addInvoice)
api.get('/getAllI', getAllInvoices)
api.get('/getIBC/:id', [validateJwt], getInvoicesByCustomer)
api.get('/getIBI/:id', [validateJwt], getInvoiceById)
api.put('/updateI/:id', [validateJwt], updateInvoice)
api.delete('/deleteI:id', [validateJwt], deleteInvoice)


export default api