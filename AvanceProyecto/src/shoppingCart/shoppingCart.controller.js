import ShoppingCart from './shoppingCart.model.js'
import Product from '../products/products.model.js'
import User from '../user/user.model.js'
import Invoice from '../invoice/invoice.model.js'
import { checkUpdate } from '../../utils/encrypt.js'


export const addCart = async (req, res) => {
    const { customer, products, quantity } = req.body
    try {
        // Verificar si el usuario existe
        const user = await User.findById(customer)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        // Convertir los productos y cantidades en arrays si no lo son
        const productIds = Array.isArray(products) ? products : products.split(',').map(id => id.trim())
        const quantities = Array.isArray(quantity) ? quantity : quantity.split(',').map(q => parseInt(q.trim()))
        if (productIds.length !== quantities.length) {
            return res.status(400).json({ message: "Products and quantities length mismatch" })
        }
        // Buscar los productos en la base de datos
        const productList = await Product.find({ _id: { $in: productIds } })
        if (productList.length !== productIds.length) {
            return res.status(404).json({ message: "One or more products not found" })
        }
        // Verificar stock de cada producto
        for (let i = 0; i < productList.length; i++) {
            if (productList[i].stock < quantities[i]) {
                return res.status(400).json({ message: `Not enough stock for product ${productList[i].name}` })
            }
        }
        // Buscar o crear un carrito para el usuario
        let shoppingCart = await ShoppingCart.findOne({ customer })
        if (!shoppingCart) {
            shoppingCart = new ShoppingCart({
                customer,
                products: [],
                total: 0
            })
        }
        // Agregar productos al carrito
        productList.forEach((prod, index) => {
            const productIndex = shoppingCart.products.findIndex(p => p.product.toString() === prod._id.toString())
            if (productIndex > -1) {
                shoppingCart.products[productIndex].quantity += quantities[index]
            } else {
                shoppingCart.products.push({ product: prod._id, quantity: quantities[index] })
            }
        })
        // Calcular el total del carrito
        shoppingCart.total = shoppingCart.products.reduce((sum, item) => {
            const prod = productList.find(p => p._id.toString() === item.product.toString())
            return sum + (item.quantity * prod.price)
        }, 0)
        // Guardar el carrito
        await shoppingCart.save()
        res.status(200).json(shoppingCart)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}  



//Listar mis carritos
export const getCarts = async (req, res) => {
    try {
        const carts = await ShoppingCart.find().populate('customer').populate('products.product')
        if (!carts.length) {
            return res.status(404).json({ message: "No shopping carts found" })
        }
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



//Actualizar Carrito
export const updateCart = async (req, res) => {
    try {
        const { customer, products, quantity } = req.body
        const { id } = req.params
        // Buscar el carrito
        let cart = await ShoppingCart.findOne({ _id: id, customer })
        if (!cart) return res.status(404).json({ message: 'Shopping cart not found' })
        // Convertir productos y cantidades a arrays si no lo son
        const productIds = Array.isArray(products) ? products : products.split(',').map(id => id.trim())
        const quantities = Array.isArray(quantity) ? quantity : quantity.split(',').map(q => parseInt(q.trim()))
        if (productIds.length !== quantities.length) {
            return res.status(400).json({ message: 'Products and quantities length mismatch' })
        }
        // Buscar los productos en la base de datos
        let productList = await Product.find({ _id: { $in: productIds } })
        if (productList.length !== productIds.length) {
            return res.status(404).json({ message: 'One or more products not found' })
        }
        // Validar stock y actualizar cantidades
        let updatedProducts = []
        let total = 0
        for (let i = 0; i < productList.length; i++) {
            if (productList[i].stock < quantities[i]) {
                return res.status(400).json({ message: `Not enough stock for product ${productList[i].name}` })
            }
            updatedProducts.push({ product: productList[i]._id, quantity: quantities[i] })
            total += productList[i].price * quantities[i];
        }
        // Actualizar el carrito con los nuevos productos y total
        cart.products = updatedProducts
        cart.total = total
        await cart.save()
        const updatedCart = await ShoppingCart.findById(id)
            .populate('products.product', ['name', 'price'])
            .populate('customer', 'username')
        return res.status(200).json({ message: 'Shopping cart updated successfully', updatedCart })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Error updating the shopping cart.' })
    }
}



//Eliminar Carrito
export const deleteCart = async(req, res) => {
    try {
        let id = req.params.id
        let shoppingCart = await ShoppingCart.findByIdAndDelete(id);
        if (!shoppingCart) return res.status(404).send({ message: 'Shopping Cart not found' });
        return res.send({ message: 'Shopping Cart deleted successfully!' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error', err });
    }
}



//Finalizar Compra
export const buyCart = async (req, res) => {
    try {
        const { customer, NIT, typeOfPayment } = req.body
        // Buscar el carrito del usuario
        let cart = await ShoppingCart.findOne({ customer }).populate('products.product')
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'Shopping cart is empty or not found' })
        }
        let total = 0
        let productDetails = []
        let products = []
        let quantities = []
        for (let item of cart.products) {
            const product = await Product.findById(item.product._id)
            if (!product) return res.status(404).json({ message: `Product not found: ${item.product._id}` })
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${product.name}` })
            }
            total += product.price * item.quantity
            product.stock -= item.quantity
            product.sold += item.quantity
            await product.save()
            productDetails.push(product)
            products.push(product._id)
            quantities.push(item.quantity)
        }
        // Crear la factura
        const invoice = new Invoice({
            customer,
            NIT,
            products,
            quantity: quantities,
            price: total,
            total,
            typeOfPayment
        })
        await invoice.save()
        // Eliminar el carrito después de la compra
        await ShoppingCart.deleteOne({ customer })
        return res.status(200).json({ success: true, message: 'Purchase completed successfully', invoice })
    } catch (err) {
        return res.status(500).json({ message: 'Error during checkout process', err })
    }
}