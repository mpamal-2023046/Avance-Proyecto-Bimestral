import { Router } from "express";
import { getAllUser,
         getUser,
         updateUser,
         deleteUser
 } from "./user.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { updateUserValidator } from "../../middlewares/validators.js"


const api = Router()

//Rutas privadas (Solo se puede acceder si esta logeado)
api.get('/getAllU', getAllUser)
api.get('/getU/:id', [validateJwt], getUser)
api.put('/updateU/:id', [validateJwt, updateUserValidator], updateUser)
api.delete('/deleteU/:id',[validateJwt], deleteUser)

export default api