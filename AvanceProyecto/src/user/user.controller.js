import User from './user.model.js'
import Invoice from '../invoice/invoice.model.js'



 //User por defecto 
export const defaultUser = async (name, surname, username, email, password, phone, role) => {
    try {
        const userFound = await User.findOne({ role: 'ADMIN' });
        const userDontFound = await User.findOne({ role: 'DEFAULT' });
        if (!userFound && !userDontFound) {
            const data = {
                name,
                surname,
                username,
                email,
                password,
                phone,
                role
            };
            const user = new User(data);
            await user.save();
            console.log('Default user created :)');
        } else {
            console.log('Cannot create default user because it already exists')
        }
    } catch (err) {
        console.error(err);
    }
};
defaultUser('Default', 'User', 'defaultuser', 'defaultuser@gmail.com', 'De123456?', '62348238', 'ADMIN')



//Listar todos los usuarios
export const getAllUser = async(req,res)=>{
    try{
        const {limit = 20, skip = 0} = req.query
        let users = await User.find()
            .skip(skip)
            .limit(limit)   

        if(users.length === 0){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Users not found:',
                }
            )
        }
        return res.send(
            {
                success: true,
                message: 'Users found: ', 
                users
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'General error',err})
    }
}



//Obterner solo uno
export const getUser = async(req, res)=>{
    try {
        let { id } = req.params
        let user = await User.findById(id)
        if(!user) return res.status(404).send(
            {
                success: false,
                message: 'User not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'User found: ', 
                user
            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error', 
                err
            }
        )
    }
}



//Actualizar datos del usuario
export const updateUser = async(req, res)=>{
    try{
        const { id } = req.params
        const data = req.body
        const update = await User.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )
        if(!update) return res.status(404).send(
            {
                success: false,
                message: 'User not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'User updated',
                user: update
            }
        )
    }catch(err){
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}
 


//Eliminar usuario
export const deleteUser = async(req, res) => {
    try {
        let id = req.params.id;
        let user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).send({ message: 'User not found' });
        return res.send({ message: 'User deleted successfully!' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error', err });
    }
}



//Historial de compras del usuario
export const getPurchaseHistory = async (req, res) => {
    try {
        const { id } = req.params
        // Buscar todas las facturas del usuario
        const invoices = await Invoice.find({ customer: id }).populate('products')
        if (invoices.length === 0) {
            return res.status(404).send({ message: 'No purchase history found' })
        }
        return res.send({ success: true, invoices })
    } catch (err) {
        console.error("Error fetching purchase history:", err)
        return res.status(500).send({ message: 'General error', err })
    }
}