import ShoppingCart from './shoppingCart.model.js'
import Product from '../products/products.model.js'
import { checkUpdate } from '../../utils/encrypt.js'



//Agregar Carrito
export const addCart = async (req, res) => {
    try {
        let { _id } = req.user
        let data = req.body
        console.log(data.quantity)
        let products = await Product.find({ _id: data.products })
        console.log(products)
        if (!products) return res.status(404).send({ message: 'A product does not exist' })
        for (let i = 0; i < products.length; i++) {
            if (products[i].stock == 0) return res.status(400).send({ message: 'The product is not in stock' })
        }
        for (let i = 0; i < products.length; i++) {
            if (products[i]._id == data.products[i]) return res.status(400).send({ message: 'The product is already in the cart' })
        }
        for (let i = 0; i < products.length; i++) {
            console.log(products[i].stock)
            console.log(data.quantity[i])
            if (products[i].stock < data.quantity[i]) return res.status(400).send({ message: 'Quantity of product not available.' })
        }
        let total = 0
        for (let i = 0; i < products.length; i++) {
            total += products[i].price * data.quantity[i]
        }
        data.total = total
        data.customer = _id
        let shoppingCart = new ShoppingCart(data)
        await shoppingCart.save()
        return res.status(200).send({ message: 'Shopping cart added successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error creating your shopping cart.' })
    }
}



//Listar mis carritos
export const getCarts = async (req, res) => {
    try {
        let { _id } = req.user
        let carts = await ShoppingCart.find({ customer: _id }).populate('products', ['name', 'price', '-_id']).populate('customer', ['-_id', 'username'])
        return res.send(carts)
    } catch (err) {
        console.err(err)
        return res.status(500).send({ message: 'Error getting the shopping carts.' })
    }
}



//Actualizar Carrito
export const updateCart = async (req, res) => {
    try {
        let { _id } = req.user
        let { id } = req.params
        let data = req.body
        let cart = await ShoppingCart.findOne({ _id: id })
        if (!cart) return res.status(404).send({ message: 'Shopping cart is not found.' })
        let products = await Product.find({ _id: data.products })
        console.log(products)
        for (let i = 0; i < products.length; i++) {
            if (products[i].stock == 0) return res.status(400).send({ message: 'The product is not in stock' })
        }
        for (let i = 0; i < products.length; i++) {
            console.log(products[i].stock)
            console.log(data.quantity[i])
            if (products[i].stock < data.quantity[i]) return res.status(400).send({ message: 'Quantity of product not available.' })
        }
        if (cart.customer.toString() != _id.toString()) return res.status(401).send({ message: 'You cannot update the cart of another people.' })
            let total = 0
            for (let i = 0; i < products.length; i++) {
                total += products[i].price * data.quantity[i]

                data.total = total
            }
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing' })
        let updatedCart = await ShoppingCart.updateOne(
            { _id: id },
            data,
            { new: true }
        ).populate('products', ['name', 'price', '-_id']).populate('customer', ['-_id', 'username'])
        if (!updatedCart) return res.status(404).send({ message: 'Shopping cart not found' })
        return res.status(200).send({ message: `Shopping cart added successfully ${updatedCart}`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating the shopping cart.' })

    }
}



//Eliminar Carrito
export const deleteCart = async (req, res) => {
    try {
        let { id } = req.params
        let { _id } = req.user
        let cart = await ShoppingCart.findOne({ _id: id })
        if (!cart) return res.status(404).send({ message: 'Shopping cart not found' })
        if (cart.customer.toString() != _id.toString()) return res.status(401).send({ message: 'You cannot delete the cart of another user.' })
        await ShoppingCart.deleteOne({ _id: id })
        return res.status(200).send({ message: 'Shopping cart deleted successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting the shopping cart.' })
    }
}



//Eliminar Producto Del carrito
export const deleteProductCart = async (req,res) => {
    try {
        let { id } = req.params
        let {_id} = req.user
        let {product} = req.body
        let cart = await ShoppingCart.findOne({ _id: id })
        if (!cart) return res.status(404).send({ message: 'Shopping cart not found' })
        if (cart.customer.toString()!= _id.toString()) return res.status(401).send({ message: 'You cannot delete the product of another user.' })
        await ShoppingCart.updateOne({ _id: id}, { $pull: {products: product}})
        return res.status(200).send({ message: 'Shopping cart product deleted successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting the products in the shopping cart.'})
    }
}