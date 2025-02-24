//Rutas de autenticación
import { Router } from "express"
import { 
    login,
    register, 
    test 
} from "./auth.controller.js"
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { registerValidator } from "../../middlewares/validators.js"



const api = Router()

//Rutas públicas
                    //Middlewares
api.post(
    '/register', 
    [
        //Validacion de errores 
        registerValidator
    ], 
    register
)

api.post('/login', login)

//Rutas privadas
api.get('/test', validateJwt, test)

//Exporto las rutas
export default api