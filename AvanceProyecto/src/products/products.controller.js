import Product from './products.model.js'


//AGREGAR
export const addProduct = async(req, res) =>{
    try {
        const data = req.body
        const product = new Product(data)
        await product.save()
        return res.send({message: 'Product successfully'})
    } catch (err) {
        return res.status(500).send(
            {
                message: 'General error', 
                err
            }
        )
    }
}



//Obtener todos
export const getAllProducts = async(req, res)=>{
    try {
        const {limit = 20, skip = 0} = req.query
        const product = await Product.find()
            .skip(skip)
            .limit(limit)
            if(product.length === 0){
                return res.status(404).send(
                    {
                        succes: false,
                        message: 'Product not found'
                    }
                )
            }
            return res.send(
                {
                    succes: true,
                    message: 'Product found',
                    product
                }
            )
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'General error', err})
    }
}



//Obtener solo uno por Id
export const getProduct = async(req, res)=>{
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        if(!product) return res.status(404).send(
            {
                success: false,
                message: 'Product not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Product found',
                product
            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'Genreal error',
                err
            }
        )
    }
}



//Actualizar
export const updateProduct = async(req, res)=>{
    try {
        const { id } = req.params
        const data = req.body
        const update = await Product.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )
        if(!update) return res.status(404).send(
            {
                succes: false,
                message: 'Product not found'
            }
        )
        return res.send(
            {
                succes:true,
                message: 'Product update',
                user: update
            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error',
                err
            }
        )
    }
}



//ELIMINAR
export const deleteProduct = async(req,res)=> {
    try {
        let id = req.params.id
        let product = await Product.findByIdAndDelete(id)
        if(!product) return res.status(404).send({message: 'Product not founded'})
            return res.send({message: 'Delete succesfully'})
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                message: 'General error', 
                err
            }
        )
    }
}